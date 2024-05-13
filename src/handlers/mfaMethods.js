import grabMFAMethods from "../lib/grabMFAMethods";
import failedResponseWithMessage from "../responses/failedResponseWithMessage";
import successResponse from "../responses/successResponse";

export default async (request, env) => {
	try {
		const resourceResponse = await grabMFAMethods(env, request.accesstoken, request.userid);
		if (resourceResponse === '[]') {
			return successResponse(env, '["none"]');
		} else {
			return successResponse(env, resourceResponse);
		}
	} catch (error) {
		return failedResponseWithMessage(error);
	}
}
