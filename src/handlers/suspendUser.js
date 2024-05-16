import successEMPTY from "../responses/raw/success-EMPTY";
import failureEMPTY from "../responses/raw/failure-EMPTY";
import suspendUser from "../lib/suspendUser";

export default async (request, env) => {
	try {
		const updateResponse = await suspendUser(env, request.accesstoken, request.userid)
		return updateResponse.status === 200
			? successEMPTY(env)
			: failureEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 418)
	}
}
