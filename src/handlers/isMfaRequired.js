import checkUserIdMiddleware from "../middleware/checkUserIdMiddleware";

export default async (request, env) => {
	await checkUserIdMiddleware(request)

	try {
		const value = await env.MFARequiredTokens.get(request.params.userid);
		return value
			? new Response(JSON.stringify({ status: false }), { status: 200, headers: { 'Content-Type': 'application/json' } })
			: new Response(JSON.stringify({ status: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
	} catch (error) {
		return error(400, error.message);
	}
}
