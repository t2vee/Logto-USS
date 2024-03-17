import { error, json, Router } from 'itty-router'

import checkTokenMiddleware from "./middleware/checkBearerTokenMiddleware";
import withMiddleware from "./middleware/withMiddleware";
import isMfaRequired from "./handlers/isMfaRequired";


import pushEmail from "./handlers/mfaFlow/email/push";
import verifyEmail from "./handlers/mfaFlow/email/verify";

import pushSMS from "./handlers/mfaFlow/sms/push";
import verifySMS from "./handlers/mfaFlow/sms/verify";


import pushNewSMS from "./handlers/newVerifyMethod/sms/push";
import verifyNewSMS from "./handlers/newVerifyMethod/sms/verify";
import removeSMS from "./handlers/newVerifyMethod/sms/remove";

import pushNewEmail from "./handlers/newVerifyMethod/email/push";
import verifyNewEmail from "./handlers/newVerifyMethod/email/verify";


import mfaMethods from "./handlers/mfaMethods";
import usernameExists from "./handlers/usernameExists";


const router = Router();

router
	.all('*', withMiddleware(async (request, env, ctx) => {return checkTokenMiddleware(request, env);}))

router.get('/api/v1/:userid/is-mfa-required', isMfaRequired);


router.post('/api/v1/mfa-flow/:userid/push-email', pushEmail);
router.post('/api/v1/mfa-flow/:userid/verify-email-code', verifyEmail);

router.post('/api/v1/mfa-flow/:userid/push-sms', pushSMS);
router.post('/api/v1/mfa-flow/:userid/verify-sms-code', verifySMS);


router.post('/api/v1/user-data-entry/new-verify-method/push-sms', pushNewSMS);
router.post('/api/v1/user-data-entry/new-verify-method/verify-sms', verifyNewSMS);
router.post('/api/v1/user-data-entry/remove-verify-method/remove-sms', removeSMS);

router.post('/api/v1/user-data-entry/new-verify-method/push-email', pushNewEmail);
router.post('/api/v1/user-data-entry/new-verify-method/verify-email', verifyNewEmail);


router.get('/api/v1/get-user-info/:userid/mfa-methods', mfaMethods);
router.get('/api/v1/check-username-exists/:username', usernameExists);


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
