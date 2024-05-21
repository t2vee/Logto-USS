import successEMPTY from "../../responses/raw/success-EMPTY";
import failureEMPTY from "../../responses/raw/failure-EMPTY";
import removeConnector from "../../lib/removeConnector";
import failureCONTENT from "../../responses/raw/failure-CONTENT";

export default async (request, env) => {
	if (!request.params || !request.params.connector) { return failureCONTENT(env, 'No Connector Type Provided', 400); }
	try {
		const updateResponse = await removeConnector(env, request.accesstoken, request.userid, request.params.connector)
		return updateResponse.status === 200
			? successEMPTY(env)
			: failureEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 418)
	}
}
