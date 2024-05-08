import fetchAccessToken from "../../../utils/fetchAccessToken";
import updateUserData from "../../../lib/updateUserData";
import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";

export default async (request, env) => {
	const accessToken = await fetchAccessToken(env);
	const requestData = await request.json();
	const userData = {
		"profile": {
			"locale": requestData.locale,
		}
	}
	const updateResponse = await updateUserData(env, accessToken, userData, request.userid)
	return updateResponse.status === 200
		? emptySuccessResponse(env)
		: failedResponse;
}
