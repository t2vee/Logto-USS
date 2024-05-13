import successJSONResponse from "../responses/successJSONResponse";
import emptySuccessResponse from "../responses/emptySuccessResponse";

export default async (request, env) => {
	try {
		const value = await env.UsernameChangeTimelimit.get(request.userid);
		return value
			? successJSONResponse(env, { value })
			: emptySuccessResponse(env);
	} catch (error) {
		return error(400, error.message);
	}
}
