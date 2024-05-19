import failureEMPTY from "../responses/raw/failure-EMPTY";
import successCONTENT from "../responses/raw/success-CONTENT";
import successEMPTY from "../responses/raw/success-EMPTY";

export default async (request, env) => {
	try {
		const value = await env.UsernameChangeTimelimit.get(request.userid);
		return value
			? successCONTENT(env, {value})
			: successEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 418)
	}
}
