import checkAvatar from "../../../utils/checkAvatar";
import uploadAvatar from "../../../utils/uploadAvatar";
import processAvatar from "../../../utils/processAvatar";
import updateUserData from "../../../lib/updateUserData";
import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureEMPTY from "../../../responses/raw/failure-EMPTY";
import failureCONTENT from "../../../responses/raw/failure-CONTENT";

const allowUploadMimeTypes = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/vnd.microsoft.icon",
	"image/x-icon",
	"image/svg+xml",
	"image/tiff",
	"image/webp",
	"image/bmp"
];
const maxUploadFileSize = 8388608;

function validateFile(file) {
	return allowUploadMimeTypes.includes(file.type) && file.size <= maxUploadFileSize;
}

export default async (request, env) => {
	const reqImg = await request.formData();
	const file = reqImg.get('file');
	if (!validateFile(file)) {
		return failureCONTENT(env,"Invalid file type or size", 400);
	}
	if (!await checkAvatar(env, file)) {
		return failureCONTENT(env, "Image failed one or more checks", 406);
	}
	const processedImage = await processAvatar(env, file);
	if (!processedImage) {
		return failureCONTENT(env, "Failed to Process the Image", 418);
	}
	try {
		const uploadResponse = await uploadAvatar(env, request.accesstoken, processedImage, request.userid);
		const userData = {
			"avatar": uploadResponse.url,
		}
		const updateResponse = await updateUserData(env, request.accesstoken, userData, request.userid)
		return updateResponse.status === 200
			? successEMPTY(env)
			: failureEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 418)
	}
}
