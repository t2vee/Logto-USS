import updateUserData from "../../../lib/updateUserData";
import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";

export default async (request, env) => {
	const requestData = await request.json();
	const userData = {
		"name": requestData.name,
	}
	const updateResponse = await updateUserData(env, request.accesstoken, userData, request.userid)
	return updateResponse.status === 200
		? emptySuccessResponse(env)
		: failedResponse;
}
