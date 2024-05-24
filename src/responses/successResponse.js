// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license. 


export default (env, body) => new Response(body, {
	status: 200,
	headers: { 'Content-Type': 'text/plain',
		'Access-Control-Allow-Origin': env.CORS,
		'Access-Control-Allow-Methods': 'GET, OPTIONS',
		'Access-Control-Allow-Headers': 'Authorization, Content-Type'
	}, })
