import updateUserData from "../../../lib/updateUserData";
import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";
import failedResponseWithMessage from "../../../responses/failedResponseWithMessage";
import {error} from "itty-router";

export default  async (request, env) => {
	const url = new URL(request.url);
	const userId = url.searchParams.get('user-id')
	const userIdPattern = /^[a-zA-Z0-9]{12}$/;
	if (!userIdPattern.test(userId)) {
		return error(400, 'Invalid UserID Provided');
	}
	try {
		const payload = {
			"primaryPhone": null
		}
		const response = await updateUserData(env, request.accesstoken, payload, userId)
		return response.status === 200
			? emptySuccessResponse(env)
			: failedResponse;
	} catch (error) {
		return failedResponseWithMessage(error);
	}
}
