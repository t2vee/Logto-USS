// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


// these imports are horrifying - less horrifying now but still not great
import { AutoRouter, cors } from 'itty-router'
import checkTokenMiddleware from "./middleware/checkBearerTokenMiddleware";
import attachAccessToken from "./middleware/attachAccessToken";
import failureCONTENT from "./responses/raw/content400";
import checkVerificationCodeMiddleware from "./middleware/checkVerificationCodeMiddleware";
import initialiseRequest from './middleware/initialiseRequest'
import { HandlerRouter } from './handlers'
import HandleSpotifyUserInfoEndpoint from './handlers/handleSpotifyUserInfoEndpoint'

const { preflight, corsify } = cors({
	origin: 'https://myid.mxs.app',
	credentials: true,
	allowMethods: ['GET', 'POST'],
	maxAge: 1500
})
const router = AutoRouter({
	before: [preflight],
	finally: [corsify],
});

router.get('/api/v1/oauth-user-info/endpoint/api-spotify-com/v1/me', HandleSpotifyUserInfoEndpoint)
router
	.all('*', checkTokenMiddleware)
	.all('*', attachAccessToken)
	.all('*', initialiseRequest)
	.all('*', checkVerificationCodeMiddleware)

router
	.all("/api/v2/*", HandlerRouter.fetch)
	.all('*', (env) => failureCONTENT('this is not the route you are looking for', 404))

export default { ...router }
