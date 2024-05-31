// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successCONTENT from "../../responses/raw/success-CONTENT";
import {createHttpClient} from "../../HttpClient";
import failureCONTENT from "../../responses/raw/failure-CONTENT";

export default async (request, env) => {
	try {
		const uri = `/api/users/${request.userid}/mfa-verifications`
		const http = createHttpClient(env, request.accesstoken);
		const totp = await http.post(uri, {data: {"type": "Totp"},});
		const code = await http.post(uri, {data: {"type": "BackupCode"},});
		return successCONTENT(env, {
			"AppAuthenticator": totp,
			"BackupCodes": code,
		});
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)}
}
