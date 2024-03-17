import fetchAccessToken from "../../../utils/fetchAccessToken";
import grabUserDetails from "../../../lib/grabUserDetails";
import sendEmailVerificationCode from "../../../lib/sendEmailVerificationCode";
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
		const response = await sendEmailVerificationCode(env, accessToken, usrDObj.primaryEmail);
		return response.status === 204
			? emptySuccessResponse(env)
			: failedResponse;
	} catch (e) {
		return failedResponseWithMessage(e);
	}
}
