import fetchAccessToken from "../../../utils/fetchAccessToken";
import updateUserData from "../../../lib/updateUserData";
import checkUserIdMiddleware from "../../../middleware/checkUserIdMiddleware";
import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";
import failedResponseWithMessage from "../../../responses/failedResponseWithMessage";

export default async (request, env) => {
	const usernameRegex = new RegExp(/^[a-zA-Z0-9]{3,24}$/)
	const userId = await checkUserIdMiddleware(request)
	const accessToken = await fetchAccessToken(env);
	const requestData = await request.json();
	if (usernameRegex.test(requestData.username)) {
		const userData = {"username": requestData.username}
		const updateResponse = await updateUserData(env, accessToken, userData, userId)
		return updateResponse.status === 200
			? emptySuccessResponse(env)
			: failedResponse;
	}
	return failedResponseWithMessage('Invalid username');
}
