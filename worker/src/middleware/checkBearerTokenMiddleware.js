// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import verifyAuthToken from "../utils/verifyAuthToken";
import { error } from 'itty-router'

export default async (request, env, ctx) => {
	try {
		const tokenInfo = await verifyAuthToken(request, env);
		ctx.userid = tokenInfo.sub;
		console.log('[MIDDLEWARE] Bearer Token Check Succeeded')
	} catch (e) {
		console.log('[MIDDLEWARE] Bearer Token Check FAILED')
		return error(401, 'ERR_FAILED_TO_VERIFY_TOKEN');
	}
}
