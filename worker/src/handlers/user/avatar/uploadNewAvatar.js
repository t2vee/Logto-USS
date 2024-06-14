// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import checkAvatar from "../../../utils/checkAvatar";
import uploadAvatar from "../../../utils/uploadAvatar";
import processAvatar from "../../../utils/processAvatar";
import { status, error } from 'itty-router';

const allowUploadMimeTypes = [
	"image/jpeg",
	"image/png",
];
function validateFile(file) {
	return allowUploadMimeTypes.includes(file.type) && file.size <= 1073741824;
}

export const handler = async (request, env, ctx) => {
	try {
		const reqImg = await request.formData();
		const file = reqImg.get('file');
		if (!validateFile(file)) {return error(400,"ERR_INVALID_IMG");}
		if (env.ENABLE_NSFW_CHECK) {
			if (!await checkAvatar(env, file)) {return error(406, "ERR_IMG_FAILED_CHECK");}
		}
		const i = await processAvatar(env, file)
		if (!i) {return error(500, "ERR_IMG_PROCESS_FAILED");}
		const uploadResponse = await uploadAvatar(env, ctx.accesstoken, i, ctx.userid);
		await ctx.Http.patch(
			`/api/users/${ctx.userid}`,
			{data: {"avatar": uploadResponse.url,}
			});
		return status(204);
	} catch (e) {
		console.error(e)
		return error(e)
	}
}
