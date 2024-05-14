import grabMFAMethods from "../lib/grabMFAMethods";
import successCONTENT from "../responses/raw/success-CONTENT";
import failureEMPTY from "../responses/raw/failure-EMPTY";

export default async (request, env) => {
	try {
		const resourceResponse = await grabMFAMethods(env, request.accesstoken, request.userid);
		if (resourceResponse === '[]') {
			return successCONTENT(env, '["none"]');
		} else {
			return successCONTENT(env, resourceResponse);
		}
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 418)
	}
}
