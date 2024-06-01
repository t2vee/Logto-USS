// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


// these imports are horrifying
import { Router } from 'itty-router'
import checkTokenMiddleware from "./middleware/checkBearerTokenMiddleware";
import withMiddleware from "./middleware/withMiddleware";
import isMfaRequired from "./handlers/user/isMfaRequired";
import pushEmail from "./handlers/user/mfa/flow/push-email";
import verifyEmail from "./handlers/user/mfa/flow/verify-email";
import pushSMS from "./handlers/user/mfa/flow/push-sms";
import verifySMS from "./handlers/user/mfa/flow/verify-sms";
import pushNewSMS from "./handlers/user/mfa/new/push-sms";
import verifyNewSMS from "./handlers/user/mfa/new/verify-sms";
import removeSMS from "./handlers/user/mfa/new/remove-number";
import pushNewEmail from "./handlers/user/mfa/new/push-email";
import verifyNewEmail from "./handlers/user/mfa/new/verify-email";
import updateFullName from "./handlers/user/update/updateFullName";
import mfaMethods from "./handlers/user/mfa/methods/mfaMethods";
import usernameExists from "./handlers/user/usernameExists";
import extendedUserData from "./handlers/user/extendedUserData";
import corsPreflight from "./headers/corsPreflight";
import HandleSpotifyUserInfoEndpoint from "./lib/handleSpotifyUserInfoEndpoint";
import updateUsername from "./handlers/user/update/updateUsername";
import updateLocale from "./handlers/user/update/updateLocale";
import updateBirthday from "./handlers/user/update/updateBirthday";
import updateRegionalSettings from "./handlers/user/update/updateRegionalSettings";
import updatePassword from "./handlers/user/update/updatePassword";
import uploadNewAvatar from "./handlers/user/avatar/uploadNewAvatar";
import attachAccessToken from "./middleware/attachAccessToken";
import canChangeUsername from "./handlers/user/canChangeUsername";
import removeAvatar from "./handlers/user/avatar/removeAvatar";
import failureCONTENT from "./responses/raw/failure-CONTENT";
import suspendUser from "./handlers/user/danger/suspendUser";
import terminateUser from "./handlers/user/danger/terminateUser";
import createNewMfaMethod from "./handlers/user/mfa/methods/createNewMfaMethod";
import removeMfaMethod from "./handlers/user/mfa/methods/removeMfaMethod";
import buildConnectorAuthUri from "./handlers/user/connectors/buildConnectorAuthUri";
import linkConnector from "./handlers/user/connectors/linkConnector";
import removeConnector from "./handlers/user/connectors/removeConnector";
import checkVerificationCodeMiddleware from "./middleware/checkVerificationCodeMiddleware";


const router = Router();
router.options('*', corsHeaders) // need to fix cors headers so they are specific for each path

router.get('/api/v1/oauth-user-info/endpoint/api-spotify-com/v1/me', HandleSpotifyUserInfoEndpoint)

router // the entire middleware system is a hack and a mess. i would like to change it but im lazy so
	.all('*', withMiddleware(async (request, env, ctx) => {return checkVerificationCodeMiddleware(request, env);}))
	.all('*', withMiddleware(async (request, env, ctx) => {return checkTokenMiddleware(request, env);}))
	.all('*', withMiddleware(async (request, env, ctx) => {return attachAccessToken(request, env);}))

// TODO Implement DataValidator lib for all userdata routes
// TODO Implement DataHistory lib for all userdata routes
router.post('/api/v1/mfa-flow/push-email', pushEmail);
router.post('/api/v1/mfa-flow/verify-email-code', verifyEmail);

router.post('/api/v1/mfa-flow/push-sms', pushSMS);
router.post('/api/v1/mfa-flow/verify-sms-code', verifySMS);

router.post('/api/v2/me/mfa/create', createNewMfaMethod);
router.post('/api/v2/me/mfa/remove', removeMfaMethod);

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

// TODO NEED TO BE IMPLEMENTED - will take fucking forever
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

router.post('/api/v2/me/dangerzone/suspendme', suspendUser)
router.post('/api/v2/me/dangerzone/terminate', terminateUser)

router.post('/api/v2/connectors/build-uri/:connector', buildConnectorAuthUri)
router.post('/api/v2/connectors/link/:connector', linkConnector)
router.post('/api/v2/connectors/remove/:connector', removeConnector)


/**
 * Creates a response with CORS headers.
 *
 * @param {Request} request - The incoming request to respond to.
 * @param env
 * @returns {Response} A response object with appropriate CORS headers.
 */
function corsHeaders(request, env) {
	const headers = corsPreflight(env);
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
// Verified and Tested - Success - 18/03/24 <= was a lie, no wildcard paths work is they are below the auth middleware line <= im just stupid, thats the whole point. that it 404s even if the user is authenticated
router.all('*', (env) => failureCONTENT(env, 'this is not the route you are looking for', 404));

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
