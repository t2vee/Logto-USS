import jsonSuccess from "../headers/jsonSuccess";

export default (env, body) =>
	Response.json(body, {
		status: 200,
		headers: jsonSuccess(env)
	}
)
