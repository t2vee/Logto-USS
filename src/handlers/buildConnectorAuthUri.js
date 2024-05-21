import failureEMPTY from "../responses/raw/failure-EMPTY";
import failureCONTENT from "../responses/raw/failure-CONTENT";
import grabBuiltConnectorUri from "../lib/grabBuiltConnectorUri";
import successCONTENT from "../responses/raw/success-CONTENT";

export default async (request, env) => {
	try {
		if (!request.params || !request.params.connector) { return failureCONTENT(env, 'No Connector Type Provided', 400); }
		const requestData = await request.json();

		const uriParams = {
			"state": Array.from(crypto.getRandomValues(new Uint32Array(request.userid.length)), dec => ('0' + dec.toString(16)).substr(-2)).join(''),
			"redirectUri": requestData.redirectUri,
		}
		const buildResponse = await grabBuiltConnectorUri(env, request.accesstoken, uriParams, request.params.connector.toLowerCase())
		return buildResponse.status === 200
			? successCONTENT(env, await buildResponse.json())
			: failureEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 418)
	}
}
