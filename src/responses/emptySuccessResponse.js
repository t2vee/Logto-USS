import emptySuccess from "../headers/emptySuccess";

export default (env) => new Response(null, {
	status: 204,
	headers: emptySuccess
})
