import fetchAccessToken from "../../../utils/fetchAccessToken";
import updateUserProfile from "../../../lib/updateUserProfile";
import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";

export default async (request, env) => {
	const accessToken = await fetchAccessToken(env);
	const requestData = await request.json();
	const userData = {
		"profile": {
			"birthdate": requestData.birthday,
		}
	}
	const updateResponse = await updateUserProfile(env, accessToken, userData, request.userid)
	return updateResponse.status === 200
		? emptySuccessResponse(env)
		: failedResponse;
}
