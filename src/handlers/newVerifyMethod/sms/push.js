import decryptNumber from "../../../utils/decryptNumber";
import prepareNumber from "../../../utils/prepareNumber";
import sendSMSVerificationCode from "../../../lib/sendSMSVerificationCode";
import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";
import failedResponseWithMessage from "../../../responses/failedResponseWithMessage";

export default async (request, env) => {
	const requestData = await request.json();
	const encryptedPhoneNumber = requestData.encryptedPhoneNumber;
	try {
		const userNumber = await decryptNumber(env, encryptedPhoneNumber);
		const num = await prepareNumber(userNumber)
		const response = await sendSMSVerificationCode(env, request.accesstoken, num);
		return response.status === 204
			? emptySuccessResponse(env)
			: failedResponse();
	} catch (error) {
		console.log(error)
		return failedResponseWithMessage(error);
	}
}
