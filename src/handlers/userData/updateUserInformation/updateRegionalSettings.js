import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";
import updateUserProfile from "../../../lib/updateUserProfile";

export default async (request, env) => {
	const requestData = await request.json();
	const userData = {
		"profile": {
			"address": {
				"locality": requestData.timezone,
			}
		}
	}
	if (requestData.country) {
		userData.profile.address.country = requestData.country;
	}
	const updateResponse = await updateUserProfile(env, request.accesstoken, userData, request.userid)
	return updateResponse.status === 200
		? emptySuccessResponse(env)
		: failedResponse;
}
