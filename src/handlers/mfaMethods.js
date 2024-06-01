// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import {createHttpClient} from "../HttpClient";
import successCONTENT from "../responses/raw/success-CONTENT";
import failureCONTENT from "../responses/raw/failure-CONTENT";

export default async (request, env) => {
	try {
		const http = createHttpClient(env, request.accesstoken);
		const r = await http.get(`/api/users/${encodeURIComponent(request.userid)}/mfa-verifications`, {});
		return r === '[]' ?
			successCONTENT(env, ["none"]) :
			successCONTENT(env, r)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)	}
}
