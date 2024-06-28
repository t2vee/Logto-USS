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
	origin: 'https://demo-id.mxs.app',
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

export default { async scheduled(event, env, ctx) {
		console.log("cron triggered")
	//await ctx.Http.patch(
	//		`/api/users/${ctx.userid}`,
	//		{data: {"username":"demouser","primaryEmail":"demo@example.org","primaryPhone":null,"name":null,"avatar":"https://logtoeu.blob.core.windows.net/public-blobs/v32424/b4y2f9pjhuus1yvwq9p3f/2024/06/28/xo2cq1n6/e2dbd922-4d04-40ac-bd12-eae6f4ad5913__thgjnul6yufh__1719600780428.webp","customData":{},"identities":{},"profile":{},"isSuspended":false}
	//		});
	}, ...router
}

