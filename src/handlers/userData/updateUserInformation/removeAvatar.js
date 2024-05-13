import updateUserData from "../../../lib/updateUserData";
import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";
import failedResponseWithMessage from "../../../responses/failedResponseWithMessage";

export default async (request, env) => {
	try {
		const payload = {
			"avatar": null
		}
		const response = await updateUserData(env, request.accesstoken, payload, request.userid)
		return response.status === 200
			? emptySuccessResponse(env)
			: failedResponse;
	} catch (error) {
		return failedResponseWithMessage(error);
	}
}
