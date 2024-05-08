import successJSONResponse from "../responses/successJSONResponse";

export default async (request, env) => {
	try {
		const value = await env.MFARequiredTokens.get(request.userid);
		return value
			? successJSONResponse(env, { status: false })
			: successJSONResponse(env, { status: true });
	} catch (error) {
		return error(400, error.message);
	}
}
