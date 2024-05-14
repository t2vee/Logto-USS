import CORS from "../../headers/CORS";

export default (env, content) =>
	new Response.json(
		content,
		{
			status: 200,
			headers: CORS(env, "application/json")
		}
	)
