// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successEMPTY from "../../responses/raw/success-EMPTY";
import failureCONTENT from "../../responses/raw/failure-CONTENT";
import {createHttpClient} from "../../HttpClient";

export default async (request, env) => {
	const uri = `/api/users/${request.userid}/mfa-verifications/`;
	try {
		const requestData = await request.json();
		const http = createHttpClient(env, request.accesstoken);
		await http.delete(uri + requestData.appid, {});
		await http.delete(uri + requestData.backupid, {});
		return successEMPTY(env)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)}
}
