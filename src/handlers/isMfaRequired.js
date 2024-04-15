import checkUserIdMiddleware from "../middleware/checkUserIdMiddleware";
import successJSONResponse from "../responses/successJSONResponse";

export default async (request, env) => {
	await checkUserIdMiddleware(request)

	try {
		const value = await env.MFARequiredTokens.get(request.params.userid);
		return value
			? successJSONResponse(env, { status: false })
			: successJSONResponse(env, { status: true });
	} catch (error) {
		return error(400, error.message);
	}
}
