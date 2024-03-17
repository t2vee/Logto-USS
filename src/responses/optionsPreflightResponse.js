/**
 * Generates a response for OPTIONS preflight requests with customizable headers.
 * @param {Object} options Custom options to override default header values.
 * @param methods
 * @returns {Response} A Response object configured with CORS and security headers.
 */
export default function preflightResponse(methods = ["GET, POST, OPTIONS"], options = {}) {
	const defaultHeaders = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": methods,
		"Access-Control-Allow-Headers": "Content-Type, Authorization",
		"Access-Control-Max-Age": "86400",
		"Content-Security-Policy": "default-src 'self'",
		"X-Content-Type-Options": "nosniff",
		"X-Frame-Options": "DENY",
		"Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
		"X-XSS-Protection": "1; mode=block",
		"Referrer-Policy": "no-referrer",
		...options,
	};

	return new Response(null, {
		status: 204,
		headers: defaultHeaders,
	});
}
