// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import grabUserDetails from "../../../lib/grabUserDetails";
import successEMPTY from "../../../responses/raw/success-EMPTY";
import { createHttpClient } from "../../../HttpClient";
import failureCONTENT from "../../../responses/raw/failure-CONTENT";

export default async (request, env) => {
	try {
		const http = createHttpClient(env, request.accesstoken);
		const userData = await grabUserDetails(env, request.accesstoken, request.userid);
		const usrDObj = JSON.parse(userData);
		await http.post(
			'/api/verification-codes/verify',
			{ email: usrDObj.primaryEmail, "verificationCode": request.verificationCode },
		);
		await env.MFARequiredTokens.put(request.userid, false, {expirationTtl: 900});
		return successEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)
	}
}
