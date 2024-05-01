import fetchAccessToken from "../../utils/fetchAccessToken";
import failedResponseWithMessage from "../../responses/failedResponseWithMessage";
import checkUserIdMiddleware from "../../middleware/checkUserIdMiddleware";
import grabUserDetails from "../../lib/grabUserDetails";
import successJSONResponse from "../../responses/successJSONResponse";

export default async (request, env) => {
	await checkUserIdMiddleware(request)
	try {
		const accessToken = await fetchAccessToken(env);
		const userData = await grabUserDetails(env, accessToken, request.params.userid)
		const usrDObj = JSON.parse(userData)
		return successJSONResponse(env, usrDObj);
	} catch (error) {
		return failedResponseWithMessage(error);
	}
}
