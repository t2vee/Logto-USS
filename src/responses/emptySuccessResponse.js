export default (env) => new Response(null, {
	status: 204,
	headers: { 'Content-Type': 'text/plain',
		'Access-Control-Allow-Origin': env.CORS,
		'Access-Control-Allow-Methods': 'GET, POST',
		'Access-Control-Allow-Headers': 'Authorization, Content-Type'
	}
})
