// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

// ITTY
import {AutoRouter, cors, error} from 'itty-router'
// MIDDLEWARE
import checkTokenMiddleware from "./middleware/checkBearerTokenMiddleware";
import attachAccessToken from "./middleware/attachAccessToken";
import initialiseRequest from './middleware/initialiseRequest'
import checkVerificationCodeMiddleware from "./middleware/checkVerificationCodeMiddleware";
// HANDLERS
import { HandlerRouter } from './handlers'


const { preflight, corsify } = cors({
	origin: 'https://myid.mxs.app',
	credentials: true,
	allowMethods: ['GET', 'POST'],
	maxAge: 15000
})
const router = AutoRouter({
	before: [preflight],
	finally: [corsify],
});

router
	.all('*', checkTokenMiddleware)
	.all('*', attachAccessToken)
	.all('*', initialiseRequest)
	.all('*', checkVerificationCodeMiddleware)

router
	.all("/api/v2/*", HandlerRouter.fetch)
	.all('*', () => error(404, 'this is not the route you are looking for'))

export default { ...router }
