import { Router } from 'itty-router';
import verifyAuthToken from "./utils/verifyAuthToken";
import fetchAccessToken from "./utils/fetchAccessToken";
import grabMFAMethods from "./controllers/grabMFAMethods";
import checkUsernameAvailability from "./controllers/checkUsernameAvailability";

import updateUserData from "./controllers/updateUserData";
import grabUserDetails from "./controllers/grabUserDetails";
import decryptNumber from "./utils/decryptNumber";

import sendEmailVerificationCodeFromUserId from "./controllers/sendEmailVerificationCodeFromUserId";
import sendSMSVerificationCode from "./controllers/sendSMSVerificationCode";

import verifySMSCode from "./controllers/verifySMSCode";
import verifyEmailCodeFromUserId from "./controllers/verifyEmailCodeFromUserId";
import prepareNumber from "./utils/prepareNumber";


const router = Router();

router.options('*', (request) => corsHeaders(request));


router.get('/api/v1/:userid/is-mfa-required', async (request, env) => {
	if (!request.params || !request.params.userid) {
		return new Response(JSON.stringify({ message: 'No UserID Provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
	}
	try {
		await verifyAuthToken(request, env);
	} catch (e) {
		return new Response('Token Check Failed', {status: 400});
	}
	try {
		const value = await env.MFARequiredTokens.get(request.params.userid);
		return value
			? new Response(JSON.stringify({ status: false }), { status: 200, headers: { 'Content-Type': 'application/json' } })
			: new Response(JSON.stringify({ status: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), { status: error.status || 500, headers: { 'Content-Type': 'application/json' } });
	}
});



router.post('/api/v1/mfa-flow/:userid/push-email', async (request, env) => {
	if (!request.params || !request.params.userid) {
		return new Response(JSON.stringify({ message: 'No UserID Provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
	}
	try {
		await verifyAuthToken(request, env);
	} catch (e) {
		return new Response('Token Check Failed', {status: 400});
	}
	try {
		const accessToken = await fetchAccessToken(env);
		const userData = await grabUserDetails(env, accessToken, request.params.userid)
		const usrDObj = JSON.parse(userData)
		const response = await sendEmailVerificationCodeFromUserId(env, accessToken, usrDObj.primaryEmail);
		return response.status === 204
			? new Response(null, {
			status: 204,
			headers: { 'Content-Type': 'text/plain',
				'Access-Control-Allow-Origin': env.CORS,
				'Access-Control-Allow-Methods': 'POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Authorization, Content-Type'
			}, })
			: new Response(JSON.stringify({ status: 'failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), { status: error.status || 500, headers: { 'Content-Type': 'application/json' } });
	}
});



/**
 * Handles the POST request to verify an email code as part of the multi-factor authentication flow.
 * This route validates the `userid` and `verificationCode` parameters, ensuring the `userid` is a 12-character
 * alphanumeric string without symbols, and the `verificationCode` is a 6-digit code.
 *
 * @param {Request} request The incoming request object. It contains the `userid` as part of the URL path
 *                          and expects a `verification-code` as a URL search parameter.
 * @param {Object} env An object containing environment variables and other server-side configurations.
 *
 * @returns {Response} Returns a `Response` object. If the validation fails, it returns a 400 status code with
 *                     an error message. On successful validation but failed authentication or other errors,
 *                     it returns a 500 status code with an error message. If the verification is successful,
 *                     it returns a 204 status code and optionally updates the MFARequiredTokens state.
 *
 * @route `POST /api/v1/mfa-flow/:userid/verify-email-code`
 *
 * @example
 * // URL format: /api/v1/mfa-flow/a3sv2i21ubfy/verify-email-code?verification-code=123456
 *
 * @validation
 * - `userid` must be a 12-character alphanumeric string, validated against /^[a-zA-Z0-9]{12}$/ regex.
 * - `verificationCode` must be a 6-digit number, validated against /^\d{6}$/ regex.
 *
 * @error Handling
 * - Returns a 400 status code if `userid` or `verification-code` are missing or invalid.
 * - Returns a 500 status code with an error message if there's an error during the verification process or
 *   if the server encounters an unexpected error.
 */
router.post('/api/v1/mfa-flow/:userid/verify-email-code', async (request, env) => {
	const userIdPattern = /^[a-zA-Z0-9]{12}$/;
	if (!request.params || !request.params.userid || !userIdPattern.test(request.params.userid)) {
		return new Response(JSON.stringify({ message: 'Invalid UserID Provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
	}

	const url = new URL(request.url);
	const verificationCode = url.searchParams.get('verification-code');
	const verificationCodePattern = /^\d{6}$/;
	if (!verificationCode || !verificationCodePattern.test(verificationCode)) {
		return new Response(JSON.stringify({ message: 'Invalid verification code provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
	}

	try {
		await verifyAuthToken(request, env);
	} catch (e) {
		return new Response('Token Check Failed', {status: 400});
	}

	try {
		const accessToken = await fetchAccessToken(env);
		const userData = await grabUserDetails(env, accessToken, request.params.userid);
		const usrDObj = JSON.parse(userData);
		const response = await verifyEmailCodeFromUserId(env, accessToken, usrDObj.primaryEmail, verificationCode);
		return response.status === 204
			? env.MFARequiredTokens.put(request.params.userid, false, {expirationTtl: 9000})  && new Response(null, {
			status: 204,
			headers: { 'Content-Type': 'text/plain',
				'Access-Control-Allow-Origin': env.CORS,
				'Access-Control-Allow-Methods': 'POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Authorization, Content-Type'
			}, })
			: new Response(JSON.stringify({ status: 'failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), { status: error.status || 500, headers: { 'Content-Type': 'application/json' } });
	}
});



router.post('/api/v1/mfa-flow/:userid/push-sms', async (request, env) => {
	if (!request.params || !request.params.userid) {
		return new Response(JSON.stringify({ message: 'No UserID Provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
	}
	try {
		await verifyAuthToken(request, env);
	} catch (e) {
		return new Response('Token Check Failed', {status: 400});
	}
	try {
		const accessToken = await fetchAccessToken(env);
		const userData = await grabUserDetails(env, accessToken, request.params.userid)
		const usrDObj = JSON.parse(userData)
		const response = await sendSMSVerificationCode(env, accessToken, await prepareNumber(usrDObj.primaryPhone));
		return response.status === 204
			? new Response(null, {
				status: 204,
				headers: { 'Content-Type': 'text/plain',
					'Access-Control-Allow-Origin': env.CORS,
					'Access-Control-Allow-Methods': 'POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Authorization, Content-Type'
				}, })
			: new Response(JSON.stringify({ status: 'failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), { status: error.status || 500, headers: { 'Content-Type': 'application/json' } });
	}
});



router.post('/api/v1/mfa-flow/:userid/verify-sms-code', async (request, env) => {
	const userIdPattern = /^[a-zA-Z0-9]{12}$/;
	if (!request.params || !request.params.userid || !userIdPattern.test(request.params.userid)) {
		return new Response(JSON.stringify({ message: 'Invalid UserID Provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
	}

	const url = new URL(request.url);
	const verificationCode = url.searchParams.get('verification-code');
	const verificationCodePattern = /^\d{6}$/;
	if (!verificationCode || !verificationCodePattern.test(verificationCode)) {
		return new Response(JSON.stringify({ message: 'Invalid verification code provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
	}

	try {
		await verifyAuthToken(request, env);
	} catch (e) {
		return new Response('Token Check Failed', {status: 400});
	}

	try {
		const accessToken = await fetchAccessToken(env);
		const userData = await grabUserDetails(env, accessToken, request.params.userid);
		const usrDObj = JSON.parse(userData);
		const response = await verifySMSCode(env, accessToken, await prepareNumber(usrDObj.primaryPhone), verificationCode);
		return response.status === 204
			? env.MFARequiredTokens.put(request.params.userid, false, {expirationTtl: 9000})  && new Response(null, {
			status: 204,
			headers: { 'Content-Type': 'text/plain',
				'Access-Control-Allow-Origin': env.CORS,
				'Access-Control-Allow-Methods': 'POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Authorization, Content-Type'
			}, })
			: new Response(JSON.stringify({ status: 'failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), { status: error.status || 500, headers: { 'Content-Type': 'application/json' } });
	}
});



router.post('/api/v1/user-data-entry/new-verify-method/verify-sms', async (request, env) => {
	try {
		await verifyAuthToken(request, env);
	} catch (e) {
		return new Response('Token Check Failed', {status: 400});
	}
	const url = new URL(request.url);
	const verificationCode = url.searchParams.get('verification-code');
	const userId = url.searchParams.get('user-id');
	const verificationCodePattern = /^\d{6}$/;
	if (!verificationCode || !verificationCodePattern.test(verificationCode)) {
		return new Response(JSON.stringify({ message: 'Invalid verification code provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
	}
	const requestData = await request.json();
	const encryptedPhoneNumber = requestData.encryptedPhoneNumber;
	const userNumber = await decryptNumber(env, encryptedPhoneNumber);
	try {
		const accessToken = await fetchAccessToken(env);
		const response = await verifySMSCode(env, accessToken, await prepareNumber(userNumber), verificationCode);
		if (response.status === 204) {
			const userData = {
				"primaryPhone": await prepareNumber(userNumber)
			}
			const updateResponse = await updateUserData(env, accessToken, userData, userId)
			return response.status === 204 && updateResponse.status === 200
				? new Response(null, {
					status: 204,
					headers: { 'Content-Type': 'text/plain',
						'Access-Control-Allow-Origin': env.CORS,
						'Access-Control-Allow-Methods': 'POST, OPTIONS',
						'Access-Control-Allow-Headers': 'Authorization, Content-Type'
					}, })
				: new Response(JSON.stringify({ status: 'failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
		} else {
			return new Response(JSON.stringify({ status: 'failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
		}
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), { status: error.status || 500, headers: { 'Content-Type': 'application/json' } });
	}
});



router.post('/api/v1/user-data-entry/new-verify-method/push-sms', async (request, env) => {
	try {
		await verifyAuthToken(request, env);
	} catch (e) {
		console.log(e)
		return new Response('Token Check Failed', {status: 400});
	}
	const requestData = await request.json();
	const encryptedPhoneNumber = requestData.encryptedPhoneNumber;

	try {
		const accessToken = await fetchAccessToken(env);
		const userNumber = await decryptNumber(env, encryptedPhoneNumber);
		const response = await sendSMSVerificationCode(env, accessToken, await prepareNumber(userNumber));
		return response.status === 204
			? new Response(null, {
			status: 204,
			headers: { 'Content-Type': 'text/plain',
				'Access-Control-Allow-Origin': env.CORS,
				'Access-Control-Allow-Methods': 'POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Authorization, Content-Type'
			}, })
			: new Response(JSON.stringify({ status: 'failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), { status: error.status || 500, headers: { 'Content-Type': 'application/json' } });
	}
});




router.get('/api/v1/get-user-info/:userid/mfa-methods', async (request, env) => {
	if (!request.params || !request.params.userid) {
		return new Response(JSON.stringify({ message: 'No UserID Provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
	}
	try {
		await verifyAuthToken(request, env);
	} catch (e) {
		return new Response('Token Check Failed', {status: 400});
	}
	try {
		const accessToken = await fetchAccessToken(env);
		const resourceResponse = await grabMFAMethods(env, accessToken, request.params.userid);
		if (resourceResponse === '[]') {
			return new Response('User has no MFA verification methods set up.', {
				status: 200,
				headers: { 'Content-Type': 'text/plain',
					'Access-Control-Allow-Origin': env.CORS,
					'Access-Control-Allow-Methods': 'GET, OPTIONS',
					'Access-Control-Allow-Headers': 'Authorization, Content-Type'
				}, });
		} else {
			return new Response(resourceResponse, {
				status: 200,
				headers: { 'Content-Type': 'text/plain',
					'Access-Control-Allow-Origin': env.CORS,
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
 * Route handler for checking if a username exists.
 * Verifies the auth token and checks the specified username against the resource server.
 *
 * @param {Request} request - The Fetch API request object, expected to contain the username parameter in the URL path.
 * @param {Object} context - An object containing route parameters, among which is the username to check.
 * @returns {Response} A Fetch API response object with the result of the check or an error message.
 */
router.get('/api/v1/check-username-exists/:username', async (request, env, context) => {
	if (!request.params || !request.params.username) {
		return new Response(JSON.stringify({ message: 'No Username Provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
	}
	try {
		await verifyAuthToken(request, env);
		const accessToken = await fetchAccessToken(env);
		if (!accessToken) {
			return new Response('Failed to fetch access token', { status: 500 });
		}
		const resourceResponse = await checkUsernameAvailability(env, accessToken, request.params.username);
		if (resourceResponse === '[]') {
			return new Response(null, {
				status: 204,
				headers: { 'Content-Type': 'text/plain',
					'Access-Control-Allow-Origin': env.CORS,
					'Access-Control-Allow-Methods': 'GET, OPTIONS',
					'Access-Control-Allow-Headers': 'Authorization, Content-Type'
				}, });
		} else {
			return new Response('Username taken', {
				status: 200,
				headers: { 'Content-Type': 'text/plain',
					'Access-Control-Allow-Origin': env.CORS,
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
 * @param env
 * @returns {Response} A response object with appropriate CORS headers.
 */
function corsHeaders(request, env) {
	const headers = {
		'Access-Control-Allow-Origin': env.CORS,
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
router.all('*', (env) => new Response('Not Found', { status: 404, headers: { 'Content-Type': 'text/plain','Access-Control-Allow-Origin': env.CORS, 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Authorization, Content-Type', 'Access-Control-Max-Age': '86400', } }));

function handleRequest(request, env, ctx) {
	const customHandler = (req) => router.handle(req, env, ctx);
	return customHandler(request);
}

export default {
	async fetch(request, env, ctx) {
		return handleRequest(request, env, ctx);
	}
};
