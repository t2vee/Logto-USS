import fetchAccessToken from "../../../utils/fetchAccessToken";
import grabUserDetails from "../../../lib/grabUserDetails";
import sendSMSVerificationCode from "../../../lib/sendSMSVerificationCode";
import prepareNumber from "../../../utils/prepareNumber";
import checkUserIdMiddleware from "../../../middleware/checkUserIdMiddleware";
import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";
import failedResponseWithMessage from "../../../responses/failedResponseWithMessage";

export default async (request, env) => {
	await checkUserIdMiddleware(request)
	try {
		const accessToken = await fetchAccessToken(env);
		const userData = await grabUserDetails(env, accessToken, request.params.userid)
		const usrDObj = JSON.parse(userData)
		const response = await sendSMSVerificationCode(env, accessToken, await prepareNumber(usrDObj.primaryPhone));
		return response.status === 204
			? emptySuccessResponse(env)
			: failedResponse;
	} catch (error) {
		return failedResponseWithMessage(error);
	}
}
