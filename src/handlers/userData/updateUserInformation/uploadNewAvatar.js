import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";
import failedResponseWithMessage from "../../../responses/failedResponseWithMessage";
import checkAvatar from "../../../utils/checkAvatar";
import uploadAvatar from "../../../utils/uploadAvatar";
import processAvatar from "../../../utils/processAvatar";
import updateUserData from "../../../lib/updateUserData";

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
		return failedResponseWithMessage({msg: "Invalid file type or size", status: 400});
	}
	if (!await checkAvatar(env, file)) {
		return failedResponseWithMessage({msg: "Image failed one or more checks", status: 406});
	}
	const processedImage = await processAvatar(env, file);
	if (!processedImage) {
		return failedResponseWithMessage({msg: "Failed to Process the Image", status: 500});
	}
	try {
		const uploadResponse = await uploadAvatar(env, request.accesstoken, processedImage, request.userid);
		const userData = {
			"avatar": uploadResponse.url,
		}
		const updateResponse = await updateUserData(env, request.accesstoken, userData, request.userid)
		return updateResponse.status === 200
			? emptySuccessResponse()
			: failedResponse;
	} catch (err) {
		console.error(err);
		return failedResponseWithMessage('Error processing the request!');
	}
}
