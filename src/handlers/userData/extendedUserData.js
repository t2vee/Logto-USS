import fetchAccessToken from "../../utils/fetchAccessToken";
import failedResponseWithMessage from "../../responses/failedResponseWithMessage";
import grabUserDetails from "../../lib/grabUserDetails";
import successJSONResponse from "../../responses/successJSONResponse";

export default async (request, env) => {
	try {
		const accessToken = await fetchAccessToken(env);
		const userData = await grabUserDetails(env, accessToken, request.userid)
		const usrDObj = JSON.parse(userData)
		return successJSONResponse(env, usrDObj);
	} catch (error) {
		return failedResponseWithMessage(error);
	}
}
