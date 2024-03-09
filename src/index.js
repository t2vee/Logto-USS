import { Router } from 'itty-router';
import verifyAuthToken from "./utils/verifyAuthToken";
import fetchAccessToken from "./utils/fetchAccessToken";
import checkUsernameAvailability from "./controllers/checkUsernameAvailability";

const router = Router();

router.options('*', (request) => corsHeaders(request));



/**
 * Route handler for checking if a username exists.
 * Verifies the auth token and checks the specified username against the resource server.
 *
 * @param {Request} request - The Fetch API request object, expected to contain the username parameter in the URL path.
 * @param {Object} context - An object containing route parameters, among which is the username to check.
 * @returns {Response} A Fetch API response object with the result of the check or an error message.
 */
router.get('/api/v1/check-username-exists/:username', async (request, context) => {
	if (!request.params || !request.params.username) {
		return new Response(JSON.stringify({ message: 'No Username Provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
	}
	try {
		await verifyAuthToken(request);
		const accessToken = await fetchAccessToken();
		if (!accessToken) {
			return new Response('Failed to fetch access token', { status: 500 });
		}
		const resourceResponse = await checkUsernameAvailability(accessToken, request.params.username);
		if (resourceResponse === '[]') {
			return new Response(null, {
				status: 204,
				headers: { 'Content-Type': 'text/plain',
					'Access-Control-Allow-Origin': CORS,
					'Access-Control-Allow-Methods': 'GET, OPTIONS',
					'Access-Control-Allow-Headers': 'Authorization, Content-Type'
				}, });
		} else {
			return new Response('Username taken', {
				status: 200,
				headers: { 'Content-Type': 'text/plain',
					'Access-Control-Allow-Origin': CORS,
					'Access-Control-Allow-Methods': 'GET, OPTIONS',
					'Access-Control-Allow-Headers': 'Authorization, Content-Type'
				},
			});
		}
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), { status: error.status || 500, headers: { 'Content-Type': 'application/json' } });
	}
});



/**
 * Creates a response with CORS headers.
 *
 * @param {Request} request - The incoming request to respond to.
 * @returns {Response} A response object with appropriate CORS headers.
 */
function corsHeaders(request) {
	const headers = {
		'Access-Control-Allow-Origin': CORS,
		'Access-Control-Allow-Methods': 'GET, OPTIONS',
		'Access-Control-Allow-Headers': 'Authorization, Content-Type',
		'Access-Control-Max-Age': '86400',
	};
	if (request.method === 'OPTIONS') {
		return new Response(null, { headers });
	}
	return new Response(null, {
		headers: {
			...headers,
		},
	});
}



/**
 * Catch-all handler for any requests that do not match the defined routes.
 * This handler returns a 404 Not Found response, indicating that the requested resource does not exist.
 *
 * @returns {Response} A Fetch API response object with a 404 status code and a message indicating that the resource was not found.
 */
router.all('*', () => new Response('Not Found', { status: 404, headers: { 'Content-Type': 'text/plain','Access-Control-Allow-Origin': CORS, 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Authorization, Content-Type', 'Access-Control-Max-Age': '86400', } }));

addEventListener('fetch', event => {
	event.respondWith(router.handle(event.request, event));
});
