import failureEMPTY from "../responses/raw/failure-EMPTY";
import successCONTENT from "../responses/raw/success-CONTENT";

export default async (request, env) => {
	try {
		const value = await env.UsernameChangeTimelimit.get(request.userid);
		return value
			? successCONTENT(env, {value})
			: failureEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 418)
	}
}
