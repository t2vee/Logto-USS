import failureEMPTY from "../../responses/raw/failure-EMPTY";
import removeMethod from "../../lib/mfa/removeMethod";
import successEMPTY from "../../responses/raw/success-EMPTY";

export default async (request, env) => {
	try {
		const requestData = await request.json();
		const updateResponse = await removeMethod(env, request.accesstoken, request.userid, requestData)
		return updateResponse
			? successEMPTY(env)
			: failureEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 418)
	}
}
