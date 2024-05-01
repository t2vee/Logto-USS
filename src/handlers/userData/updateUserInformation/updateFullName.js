import fetchAccessToken from "../../../utils/fetchAccessToken";
import updateUserData from "../../../lib/updateUserData";
import checkUserIdMiddleware from "../../../middleware/checkUserIdMiddleware";
import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";

export default async (request, env) => {
	const userId = await checkUserIdMiddleware(request)
	const accessToken = await fetchAccessToken(env);
	const requestData = await request.json();
	const userData = {
		"name": requestData.name,
	}
	const updateResponse = await updateUserData(env, accessToken, userData, userId)
	return updateResponse.status === 200
		? emptySuccessResponse(env)
		: failedResponse;
}
