import CORS from "../../headers/CORS";

export default (env, content, code = 400) =>
	Response.json(
		content,
		{
			status: code,
			headers: CORS(env, "application/json")
		}
	)
