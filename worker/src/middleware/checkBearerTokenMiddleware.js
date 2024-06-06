// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import verifyAuthToken from "../utils/verifyAuthToken";
import failureCONTENT from "../responses/raw/content400";

export default async (request, env, ctx) => {
	try {
		const tokenInfo = await verifyAuthToken(request, env);
		ctx.userid = tokenInfo.sub;
		console.log('[MIDDLEWARE] Bearer Token Check Succeeded')
	} catch (e) {
		console.log('[MIDDLEWARE] Bearer Token Check FAILED')
		return failureCONTENT(e.status === 401 ? 'ERR_UNAUTHORISED' : 'ERR_FAILED_TO_VERIFY_TOKEN', e.status);
	}
}
