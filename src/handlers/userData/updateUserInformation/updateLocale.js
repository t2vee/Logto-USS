import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";
import updateUserProfile from "../../../lib/updateUserProfile";

export default async (request, env) => {
	const requestData = await request.json();
	const userData = {
		"profile": {
			"locale": requestData.locale
		}
	}
	const updateResponse = await updateUserProfile(env, request.accesstoken, userData, request.userid)
	return updateResponse.status === 200
		? emptySuccessResponse(env)
		: failedResponse;
}
