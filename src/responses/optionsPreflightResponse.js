// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


/**
 * Generates a response for OPTIONS preflight requests with customizable headers.
 * @param {Object} options Custom options to override default header values.
 * @param methods
 * @returns {Response} A Response object configured with CORS and security headers.
 */
export default function preflightResponse(methods = ["GET, POST, OPTIONS"], options = {}) {
	const defaultHeaders = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
		"Access-Control-Allow-Headers": "Origin, Content-Type, Accept, Authorization",
		"Access-Control-Max-Age": "86400",
		'Access-Control-Allow-Credentials': 'true',
		"Content-Security-Policy": "default-src 'self'",
		"X-Frame-Options": "DENY",
		"Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
		"X-XSS-Protection": "1; mode=block",
		"Referrer-Policy": "no-referrer",
	};
	const res = new Response(null, {
		status: 200,
		headers: defaultHeaders,
	});
	console.log(res)
	return res;
}
