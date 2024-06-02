// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import checkAvatar from "../../../utils/checkAvatar";
import uploadAvatar from "../../../utils/uploadAvatar";
import processAvatar from "../../../utils/processAvatar";
import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureCONTENT from "../../../responses/raw/failure-CONTENT";
import {createHttpClient} from "../../../HttpClient";

const allowUploadMimeTypes = [
	"image/jpeg",
	"image/png",
];
function validateFile(file) {
	return allowUploadMimeTypes.includes(file.type) && file.size <= 8388608;
}

export default async (request, env) => {
	const reqImg = await request.formData();
	const file = reqImg.get('file');
	const http = createHttpClient(env, request.accesstoken);
	if (!validateFile(file)) {return failureCONTENT(env,"ERR_INVALID_IMG", 400);}
	if (!await checkAvatar(env, file)) {return failureCONTENT(env, "ERR_IMG_FAILED_CHECK", 406);}
	const i = await processAvatar(env, file)
	if (!i) {return failureCONTENT(env, "ERR_IMG_PROCESS_FAILED", 500);}
	try {
		const uploadResponse = await uploadAvatar(env, request.accesstoken, i, request.userid);
		await http.patch(
			`/api/users/${request.userid}`,
			{data: {"avatar": uploadResponse.url,}
			});
		return successEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)	}
}
