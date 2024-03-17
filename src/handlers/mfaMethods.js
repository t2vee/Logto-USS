import fetchAccessToken from "../utils/fetchAccessToken";
import grabMFAMethods from "../lib/grabMFAMethods";
import checkUserIdMiddleware from "../middleware/checkUserIdMiddleware";
import failedResponseWithMessage from "../responses/failedResponseWithMessage";
import successResponse from "../responses/successResponse";

export default async (request, env) => {
	await checkUserIdMiddleware(request)
	try {
		const accessToken = await fetchAccessToken(env);
		const resourceResponse = await grabMFAMethods(env, accessToken, request.params.userid);
		if (resourceResponse === '[]') {
			return successResponse(env, 'User has no MFA verification methods set up.');
		} else {
			return successResponse(env, resourceResponse);
		}
	} catch (error) {
		return failedResponseWithMessage(error);
	}
}
