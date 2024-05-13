import failedResponseWithMessage from "../../responses/failedResponseWithMessage";
import grabUserDetails from "../../lib/grabUserDetails";
import successJSONResponse from "../../responses/successJSONResponse";

export default async (request, env) => {
	try {
		const userData = await grabUserDetails(env, request.accesstoken, request.userid)
		const usrDObj = JSON.parse(userData)
		return successJSONResponse(env, usrDObj);
	} catch (error) {
		return failedResponseWithMessage(error);
	}
}
