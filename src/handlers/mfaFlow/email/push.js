// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import grabUserDetails from "../../../lib/grabUserDetails";
import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureCONTENT from "../../../responses/raw/failure-CONTENT";
import { createHttpClient } from "../../../HttpClient";

export default async (request, env) => {
	try {
		const http = createHttpClient(env, request.accesstoken);
		const userData = await grabUserDetails(env, request.accesstoken, request.userid)
		const usrDObj = JSON.parse(userData)
		await http.post(
			'/api/verification-codes',
			usrDObj.primaryEmail,
		);
		return successEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)
	}
}
