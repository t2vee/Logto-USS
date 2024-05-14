import CORS from "../../headers/CORS";

export default (env) =>
	new Response(
	null,
	{
		status: 204,
		headers: CORS(env, "text/plain")
	}
)
