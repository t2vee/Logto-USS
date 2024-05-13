import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";
import verifyOldPassword from "../../../lib/verifyOldPassword";
import failedResponseWithMessage from "../../../responses/failedResponseWithMessage";
import updateUserPassword from "../../../lib/updateUserPassword";

export default async (request, env) => {
	const requestData = await request.json();
	const verifyPasswordPayload = { "password": requestData.oldPassword }
	try {
		await verifyOldPassword(env, request.accesstoken, verifyPasswordPayload, request.userid);
	} catch (err) {
		console.error(err);
		return failedResponseWithMessage('old password does not match!')
	}
	const newPasswordPayload = { "password": requestData.password }
	const updateResponse = await updateUserPassword(env, request.accesstoken, newPasswordPayload, request.userid)
	return updateResponse.status === 200
		? emptySuccessResponse(env)
		: failedResponse;
}
