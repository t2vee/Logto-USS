import { Router } from 'itty-router';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const router = Router();


/**
 * Extracts the Bearer token from the request headers.
 *
 * @param {Headers} headers - The Headers object from the Fetch API request.
 * @returns {string} The extracted Bearer token.
 * @throws {{ message: string, status: number }} Throws an error object with a message and status code if the Authorization header is missing or if the token type is not supported.
 */
function extractBearerTokenFromHeaders(headers) {
	const authorization = headers.get('Authorization');
	if (!authorization) {
		throw { message: 'Authorization header missing', status: 401 };
	}
	if (!authorization.startsWith('Bearer ')) {
		throw { message: 'Authorization token type not supported', status: 401 };
	}
	return authorization.slice('Bearer '.length);
}



/**
 * Verifies the authorization token using the JWT verify method from the 'jose' library.
 *
 * @param {Request} request - The Fetch API request object.
 * @returns {Promise<Object>} A promise that resolves with the JWT payload if the token is successfully verified.
 * @throws {{ message: string, status: number }} Throws an error object with a message and status code if token verification fails or if the token is invalid.
 */
async function verifyAuthToken(request) {
	try {
		const token = extractBearerTokenFromHeaders(request.headers);
		const JWKS = createRemoteJWKSet(new URL(JWKS_URI));
		const { payload } = await jwtVerify(token, JWKS, {
			issuer: ISSUER,
			audience: 'https://default.logto.app/api', // Update this with your actual value
		});
		// Optionally, perform additional validations, e.g., RBAC with scope
		// if (!payload.scope.includes('some_scope')) {
		//     throw new Error('Insufficient scope');
		// }
		return payload;
	} catch (error) {
		throw typeof error === 'string' ? { message: error, status: 401 } : error;
	}
}



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
		const resourceResponse = await fetchResource(accessToken, request.params.username);
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
 * Fetches an access token from the authentication server.
 *
 * @returns {Promise<string|null>} A promise that resolves with the access token as a string if successful, or null if an error occurs.
 * @throws {{ message: string, status: number }} Throws an error object with a message and status code if fetching the access token fails.
 */
async function fetchAccessToken() {
	const url = `${LOGTO_DOMAIN}/oidc/token`;
	const credentials = btoa(`${LOGTO_APP_ID}:${LOGTO_APP_SECRET}`);
	const headers = {
		'Authorization': `Basic ${credentials}`,
		'Content-Type': 'application/x-www-form-urlencoded'
	};
	const body = 'grant_type=client_credentials&resource=https://default.logto.app/api&scope=all';
	try {
		const response = await fetch(url, { method: 'POST', headers, body });
		if (!response.ok) {
			throw { message: 'Failed to fetch access token due to network error', status: response.status };
		}
		const data = await response.json();
		if (!data.access_token) {
			throw { message: 'Access token is missing in response', status: 500 };
		}
		return data.access_token;
	} catch (error) {
		console.error('Error fetching access token:', error);
		throw typeof error === 'string' ? { message: error, status: 500 } : error;
	}
}



/**
 * Fetches a resource using the provided access token and checks for a specific username.
 *
 * @param {string} accessToken - The access token to authenticate the request.
 * @param {string} username - The username to search for in the resource.
 * @returns {Promise<string>} A promise that resolves with the resource data as a stringified JSON object.
 * @throws {{ message: string, status: number }} Throws an error object with a message and status code if accessing the resource fails.
 */
async function fetchResource(accessToken, username) {
	const url = `${LOGTO_DOMAIN}/api/users?search=${encodeURIComponent(username)}`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
	};

	try {
		const response = await fetch(url, { headers });
		if (!response.ok) {
			throw { message: 'Failed to access resource due to network error', status: response.status };
		}
		const data = await response.json();
		return JSON.stringify(data, null, 2);
	} catch (error) {
		console.error('Error accessing resource:', error);
		throw typeof error === 'string' ? { message: error, status: 500 } : error;
	}
}



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
