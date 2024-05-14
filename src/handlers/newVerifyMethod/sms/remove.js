import updateUserData from "../../../lib/updateUserData";
import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureEMPTY from "../../../responses/raw/failure-EMPTY";

export default  async (request, env) => {
	try {
		const payload = {
			"primaryPhone": null
		}
		const response = await updateUserData(env, request.accesstoken, payload, request.userid)
		return response.status === 200
			? successEMPTY(env)
			: failureEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 500)
	}
}
