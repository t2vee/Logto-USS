import fetchAccessToken from "../../../utils/fetchAccessToken";
import grabUserDetails from "../../../lib/grabUserDetails";
import verifySMSCode from "../../../lib/verifySMSCode";
import prepareNumber from "../../../utils/prepareNumber";
import checkUserIdMiddleware from "../../../middleware/checkUserIdMiddleware";
import checkVerificationCodeMiddleware from "../../../middleware/checkVerificationCodeMiddleware";
import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";
import failedResponseWithMessage from "../../../responses/failedResponseWithMessage";

export default async (request, env) => {
	await checkUserIdMiddleware(request)
	const verificationCode = await checkVerificationCodeMiddleware(request)
	try {
		const accessToken = await fetchAccessToken(env);
		const userData = await grabUserDetails(env, accessToken, request.params.userid);
		const usrDObj = JSON.parse(userData);
		const response = await verifySMSCode(env, accessToken, await prepareNumber(usrDObj.primaryPhone), verificationCode);
		return response.status === 204
			? env.MFARequiredTokens.put(request.params.userid, false, {expirationTtl: 9000})  && emptySuccessResponse(env)
			: failedResponse();
	} catch (error) {
		return failedResponseWithMessage(error);
	}
}
