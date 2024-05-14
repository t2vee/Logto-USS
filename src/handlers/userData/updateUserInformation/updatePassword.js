import verifyOldPassword from "../../../lib/verifyOldPassword";
import updateUserPassword from "../../../lib/updateUserPassword";
import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureEMPTY from "../../../responses/raw/failure-EMPTY";
import failureCONTENT from "../../../responses/raw/failure-CONTENT";

export default async (request, env) => {
	try {
		const requestData = await request.json();
		const verifyPasswordPayload = { "password": requestData.oldPassword }
		try {
			await verifyOldPassword(env, request.accesstoken, verifyPasswordPayload, request.userid);
		} catch (err) {
			return failureCONTENT(env, 'old password does not match!', 406)
		}
		const newPasswordPayload = { "password": requestData.password }
		const updateResponse = await updateUserPassword(env, request.accesstoken, newPasswordPayload, request.userid)
		return updateResponse.status === 200
			? successEMPTY(env)
			: failureEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 418)
	}
}
