// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import verifyAuthToken from "../utils/verifyAuthToken";
import failureCONTENT from "../responses/raw/failure-CONTENT";

export default async (request, env) => {
	try {
		const tokenInfo = await verifyAuthToken(request, env);
		request.userid = tokenInfo.sub;
		console.log('[MIDDLEWARE] Bearer Token Check Succeeded')
	} catch (e) {
		console.log(e)
		return failureCONTENT(env, 'Invalid or Non-existent Authentication Bearer Token', 400);
	}
}
