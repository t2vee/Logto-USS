// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


export default (env) => new Object({
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": env.CORS,
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "Origin, Content-Type, Accept, Authorization",
	"Access-Control-Max-Age": "86400",
	'Access-Control-Allow-Credentials': 'true',
	"Content-Security-Policy": "default-src 'self'",
	"X-Frame-Options": "DENY",
	"Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
	"X-XSS-Protection": "1; mode=block",
	"Referrer-Policy": "no-referrer",
});
