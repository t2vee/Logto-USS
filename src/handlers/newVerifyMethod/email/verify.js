import verifyEmailCode from "../../../lib/verifyEmailCode";
import updateUserData from "../../../lib/updateUserData";
import failedResponseWithMessage from "../../../responses/failedResponseWithMessage";
import failedResponse from "../../../responses/failedResponse";
import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import checkVerificationCodeMiddleware from "../../../middleware/checkVerificationCodeMiddleware";

export default async (request, env) => {
	const verificationCode = await checkVerificationCodeMiddleware(request)
	const requestData = await request.json();
	const email = requestData.email;
	try {
		const response = await verifyEmailCode(env, request.accesstoken, email, verificationCode);
		if (response.status === 204) {
			const userData = {
				"primaryEmail": email
			}
			const updateResponse = await updateUserData(env, request.accesstoken, userData, request.userid)
			return response.status === 204 && updateResponse.status === 200
				? emptySuccessResponse(env)
				: failedResponse;
		} else {
			return failedResponse;
		}
	} catch (error) {
		return failedResponseWithMessage(error);
	}
}
