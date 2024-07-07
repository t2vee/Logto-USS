// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import checkAvatar from "../../../../../api/utils/checkAvatar";
import uploadAvatar from "../../../../../api/utils/uploadAvatar";
import processAvatar from "../../../../../api/utils/processAvatar";
import {error, status} from '../../../../../api/libs/itty/responses';

const allowUploadMimeTypes = [
    "image/jpeg",
    "image/png",
];
function validateFile(file) {
    return allowUploadMimeTypes.includes(file.type) && file.size <= 8589934592;
}

export async function onRequestPost(ctx) {
    try {
        const reqImg = await ctx.request.formData();
        const file = reqImg.get('file');
        if (!validateFile(file)) {return error(400,"ERR_INVALID_IMG");}
        if (ctx.env.ENABLE_NSFW_CHECK) {
            if (!await checkAvatar(ctx.env, file)) {return error(406, "ERR_IMG_FAILED_CHECK");}
        }
        const i = await processAvatar(ctx.env, file)
        if (!i) {return error(500, "ERR_IMG_PROCESS_FAILED");}
        const uploadResponse = await uploadAvatar(ctx.env, ctx.accesstoken, i, ctx.userid);
        await ctx.http.patch(
            `/api/users/${ctx.userid}`,
            {data: {"avatar": uploadResponse.url,}
            });
        return status(204);
    } catch (e) {
        console.error(e)
        return error(e)
    }
}