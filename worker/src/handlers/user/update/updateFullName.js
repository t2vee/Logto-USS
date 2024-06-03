// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureCONTENT from "../../../responses/raw/failure-CONTENT";
import {createHttpClient} from "../../../HttpClient";

export default async (request, env) => {
	try {
		const http = createHttpClient(env, request.accesstoken);
		const requestData = await request.json();
		request.validator.fullName(requestData);
		await http.patch(
			`/api/users/${request.userid}`,
			{data: {"name": requestData.name}
			});
		return successEMPTY(env)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)	}
}
