import updateUserProfile from "../../../lib/updateUserProfile";
import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";

export default async (request, env) => {
	const requestData = await request.json();
	const userData = {
		"profile": {
			"birthdate": requestData.birthday,
		}
	}
	const updateResponse = await updateUserProfile(env, request.accesstoken, userData, request.userid)
	return updateResponse.status === 200
		? emptySuccessResponse(env)
		: failedResponse;
}
