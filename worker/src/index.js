// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


// these imports are horrifying
import { Router } from 'itty-router'
import checkTokenMiddleware from "./middleware/checkBearerTokenMiddleware";
import withMiddleware from "./middleware/withMiddleware";
import corsPreflight from "./headers/corsPreflight";
import attachAccessToken from "./middleware/attachAccessToken";
import failureCONTENT from "./responses/raw/failure-CONTENT";
import checkVerificationCodeMiddleware from "./middleware/checkVerificationCodeMiddleware";
import initialiseRequest from './middleware/initialiseRequest'
import { HandlerRouter } from './handlers'

const router = Router();

router.options('*', corsHeaders) // need to fix cors headers so they are specific for each path

router.get('/api/v1/oauth-user-info/endpoint/api-spotify-com/v1/me', h.HandleSpotifyUserInfoEndpoint)

// again the reason its so messy is because of itty router v4. i NEED to switch to v5
router // the entire middleware system is a hack and a mess. i would like to change it but im lazy so
	.all('*', withMiddleware(async (request, env, ctx) => {return checkTokenMiddleware(request, env, ctx);}))
	.all('*', withMiddleware(async (request, env, ctx) => {return attachAccessToken(request, env, ctx);}))
	.all('*', withMiddleware(async (request, env, ctx) => {return initialiseRequest(request, env, ctx);}))
	.all('*', withMiddleware(async (request, env, ctx) => {return checkVerificationCodeMiddleware(request, env, ctx);}))

router.all("/api/v2/*", HandlerRouter.fetch)

// TODO Implement DataHistory lib for all userdata routes
router.post('/api/v2/me/mfa-flow/push-email', h.user.mfa.flow.pushEmail);
router.post('/api/v2/me/mfa-flow/verify-email-code', h.user.mfa.flow.verifyEmail);

router.post('/api/v2/me/mfa-flow/push-sms', h.user.mfa.flow.pushSMS);
router.post('/api/v2/me/mfa-flow/verify-sms-code', h.user.mfa.flow.verifySMS);

router.post('/api/v2/me/mfa/create', h.user.mfa.createNewMfaMethod);
router.post('/api/v2/me/mfa/remove', h.user.mfa.removeMfaMethod);

router.post('/api/v2/me/verify/push-sms', h.user.mfa.new.pushNewSMS);
router.post('/api/v2/me/verify/verify-sms', h.user.mfa.new.verifyNewSMS);
router.post('/api/v2/me/edit/remove-sms', h.user.mfa.removeSMS);

router.post('/api/v2/me/verify/push-email', h.user.mfa.new.pushNewEmail);
router.post('/api/v2/me/verify/verify-email', h.user.mfa.new.verifyNewEmail);


// Implement Method to change password if old password was forgotten - not sure if i want to implement this, will probably find a alternative

// TODO NEED TO BE IMPLEMENTED
router.post('/api/v1/user-data-entry/update-user-information/privacy/third-party-data-access')
router.post('/api/v1/user-data-entry/update-user-information/privacy/profile-visibility')
router.post('/api/v1/user-data-entry/update-user-information/privacy/email-privacy')

router.post('/api/v2/me/avatar/upload', h.user.avatar.uploadNewAvatar)
router.post('/api/v2/me/avatar/remove', h.user.avatar.removeAvatar)

router.get('/api/v1/me/is-mfa-required', h.user.isMfaRequired);
router.get('/api/v1/me/mfa-methods', h.user.mfa.mfaMethods);
router.get('/api/v1/me/extended-user-info', h.user.extendedUserData);
router.get('/api/v1/me/can-change-username', h.user.canChangeUsername)

router.get('/api/v1/utils/check-username-exists/:username', h.user.usernameExists);

router.post('/api/v2/me/dangerzone/suspendme', h.user.danger.suspendUser)
router.post('/api/v2/me/dangerzone/terminate', h.user.danger.terminateUser)

router.post('/api/v2/connectors/build-uri/:connector', h.user.connectors.buildConnectorAuthUri)
router.post('/api/v2/connectors/link/:connector', h.user.connectors.linkConnector)
router.post('/api/v2/connectors/remove/:connector', h.user.connectors.removeConnector)


// TODO: switch this horrible mess over to ittys inbuilt createCors() method
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

// Verified and Tested - Success - 18/03/24 <= was a lie, no wildcard paths work is they are below the auth middleware line <= im just stupid, thats the whole point. that it 404s even if the user is authenticated
router.all('*', (env) => failureCONTENT(env, 'this is not the route you are looking for', 404));

// why <= because im still stuck on itty-router 4. time to add v5 migration to the list
function handleRequest(request, env, ctx) {
	const customHandler = (req) => router.handle(req, env, ctx);
	return customHandler(request);
}

export default {
	async fetch(request, env, ctx) {
		return handleRequest(request, env, ctx);
	}
};
