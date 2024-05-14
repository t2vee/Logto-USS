import CORS from "../../headers/CORS";

export default (env, code = 400) =>
	new Response(
		null,
		{
			status: code,
			headers: CORS(env, "text/plain")
		}
	)
