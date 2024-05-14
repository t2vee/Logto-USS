import { Router } from 'itty-router'

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


import updateFullName from "./handlers/userData/updateUserInformation/updateFullName";


import mfaMethods from "./handlers/mfaMethods";
import usernameExists from "./handlers/userData/usernameExists";
import extendedUserData from "./handlers/userData/extendedUserData";

import corsPreflight from "./headers/corsPreflight";
import HandleSpotifyUserInfoEndpoint from "./lib/handleSpotifyUserInfoEndpoint";
import updateUsername from "./handlers/userData/updateUserInformation/updateUsername";
import updateLocale from "./handlers/userData/updateUserInformation/updateLocale";
import updateBirthday from "./handlers/userData/updateUserInformation/updateBirthday";
import updateRegionalSettings from "./handlers/userData/updateUserInformation/updateRegionalSettings";
import updatePassword from "./handlers/userData/updateUserInformation/updatePassword";
import uploadNewAvatar from "./handlers/userData/updateUserInformation/uploadNewAvatar";
import attachAccessToken from "./middleware/attachAccessToken";
import canChangeUsername from "./handlers/canChangeUsername";
import removeAvatar from "./handlers/userData/updateUserInformation/removeAvatar";


const router = Router();
router.options('*', corsHeaders) // need to fix cors headers so they are specific for each path

router.get('/api/v1/oauth-user-info/endpoint/api-spotify-com/v1/me', HandleSpotifyUserInfoEndpoint)

router // the entire middleware system is a hack and a mess. i would like to change it but im lazy so
	.all('*', withMiddleware(async (request, env, ctx) => {return checkTokenMiddleware(request, env);}))
	.all('*', withMiddleware(async (request, env, ctx) => {return attachAccessToken(request, env);}))

// TODO Implement DataValidator lib for all userdata routes
// TODO Implement DataHistory lib for all userdata routes
router.post('/api/v1/mfa-flow/push-email', pushEmail);
router.post('/api/v1/mfa-flow/verify-email-code', verifyEmail);

router.post('/api/v1/mfa-flow/push-sms', pushSMS);
router.post('/api/v1/mfa-flow/verify-sms-code', verifySMS);


router.post('/api/v2/me/verify/push-sms', pushNewSMS);
router.post('/api/v2/me/verify/verify-sms', verifyNewSMS);
router.post('/api/v2/me/edit/remove-sms', removeSMS);

router.post('/api/v2/me/verify/push-email', pushNewEmail);
router.post('/api/v2/me/verify/verify-email', verifyNewEmail);


router.post('/api/v2/me/edit/full-name', updateFullName)
router.post('/api/v2/me/edit/username', updateUsername)

router.post('/api/v2/me/edit/regional-settings', updateRegionalSettings)
router.post('/api/v2/me/edit/language', updateLocale)
router.post('/api/v2/me/edit/birthday', updateBirthday)

// Implement Method to change password if old password was forgotten - not sure if i want to implement this, will probably find a alternative
router.post('/api/v2/me/edit/password', updatePassword)
// NEED TO BE IMPLEMENTED
router.post('/api/v1/user-data-entry/update-user-information/security/mfa-settings')
// NEED TO BE IMPLEMENTED
router.post('/api/v1/user-data-entry/update-user-information/privacy/third-party-data-access')
router.post('/api/v1/user-data-entry/update-user-information/privacy/profile-visibility')
router.post('/api/v1/user-data-entry/update-user-information/privacy/email-privacy')

router.post('/api/v2/me/avatar/upload', uploadNewAvatar)
router.post('/api/v2/me/avatar/remove', removeAvatar)


router.get('/api/v1/me/is-mfa-required', isMfaRequired);
router.get('/api/v1/me/mfa-methods', mfaMethods);
router.get('/api/v1/me/extended-user-info', extendedUserData);
router.get('/api/v1/me/can-change-username', canChangeUsername)

router.get('/api/v1/utils/check-username-exists/:username', usernameExists);



/**
 * Creates a response with CORS headers.
 *
 * @param {Request} request - The incoming request to respond to.
 * @param env
 * @returns {Response} A response object with appropriate CORS headers.
 */
function corsHeaders(request, env) {
	const headers = corsPreflight;
	if (request.method === 'OPTIONS') {
		return new Response(null, { headers });
	} // so jank
	return new Response(null, {
		status: 200,
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
// Verified and Tested - Success - 18/03/24 <= was a lie, no wildcard paths work is they are below the auth middleware line
//router.all('*', (env) => new Response('Not Found', { status: 404, headers: { 'Content-Type': 'text/plain','Access-Control-Allow-Origin': env.CORS, 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Authorization, Content-Type', 'Access-Control-Max-Age': '86400', } }));

// why
function handleRequest(request, env, ctx) {
	const customHandler = (req) => router.handle(req, env, ctx);
	return customHandler(request);
}

export default {
	async fetch(request, env, ctx) {
		return handleRequest(request, env, ctx);
	}
};
