import fetchAccessToken from "../utils/fetchAccessToken";
import grabMFAMethods from "../lib/grabMFAMethods";
import failedResponseWithMessage from "../responses/failedResponseWithMessage";
import successResponse from "../responses/successResponse";

export default async (request, env) => {
	try {
		const accessToken = await fetchAccessToken(env);
		const resourceResponse = await grabMFAMethods(env, accessToken, request.userid);
		if (resourceResponse === '[]') {
			return successResponse(env, '["none"]');
		} else {
			return successResponse(env, resourceResponse);
		}
	} catch (error) {
		return failedResponseWithMessage(error);
	}
}
