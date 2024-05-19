import failureEMPTY from "../../responses/raw/failure-EMPTY";
import createMethod from "../../lib/mfa/createMethod";
import successCONTENT from "../../responses/raw/success-CONTENT";

export default async (request, env) => {
	try {
		const requestData = await request.json();
		const updateResponse = await createMethod(env, request.accesstoken, request.userid, requestData.mfatype)
		return updateResponse.status === 200
			? successCONTENT(env, await updateResponse.json())
			: failureEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 418)
	}
}
