// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


// these imports are horrifying - less horrifying now but still not great
import { Router } from 'itty-router'
import checkTokenMiddleware from "./middleware/checkBearerTokenMiddleware";
import withMiddleware from "./middleware/withMiddleware";
import corsPreflight from "./headers/corsPreflight";
import attachAccessToken from "./middleware/attachAccessToken";
import failureCONTENT from "./responses/raw/failure-CONTENT";
import checkVerificationCodeMiddleware from "./middleware/checkVerificationCodeMiddleware";
import initialiseRequest from './middleware/initialiseRequest'
import { HandlerRouter } from './handlers'
import HandleSpotifyUserInfoEndpoint from './handlers/handleSpotifyUserInfoEndpoint'

const router = Router();

router.options('*', corsHeaders) // need to fix cors headers so they are specific for each path

// not bothered to do fancy routing stuff for this
router.get('/api/v1/oauth-user-info/endpoint/api-spotify-com/v1/me', HandleSpotifyUserInfoEndpoint)

// again the reason its so messy is because of itty router v4. i NEED to switch to v5
router // the entire middleware system is a hack and a mess. i would like to change it but im lazy so
	.all('*', withMiddleware(async (request, env, ctx) => {return checkTokenMiddleware(request, env, ctx);}))
	.all('*', withMiddleware(async (request, env, ctx) => {return attachAccessToken(request, env, ctx);}))
	.all('*', withMiddleware(async (request, env, ctx) => {return initialiseRequest(request, env, ctx);}))
	.all('*', withMiddleware(async (request, env, ctx) => {return checkVerificationCodeMiddleware(request, env, ctx);}))

router.all("/api/v2/*", HandlerRouter.handle)

// TODO Implement DataHistory lib for all userdata routes
// Implement Method to change password if old password was forgotten - not sure if i want to implement this, will probably find a alternative

// TODO NEED TO BE IMPLEMENTED - i keep putting it off 😐
//router.post('/api/v1/user-data-entry/update-user-information/privacy/third-party-data-access')
//router.post('/api/v1/user-data-entry/update-user-information/privacy/profile-visibility')
//router.post('/api/v1/user-data-entry/update-user-information/privacy/email-privacy')


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
//router.all('*', (env) => failureCONTENT(env, 'this is not the route you are looking for', 404));

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
