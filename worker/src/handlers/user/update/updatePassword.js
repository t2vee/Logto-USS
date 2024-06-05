// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureCONTENT from "../../../responses/raw/failure-CONTENT";
import {createHttpClient} from "../../../HttpClient";

export default async (request, env) => {
	try {
		const requestData = await request.json();
	  request.Validate.password(requestData);
		const http = createHttpClient(env, request.accesstoken);
		try {
			await http.post(
				`/api/users/${request.userid}/password/verify`,
				{data: { "password": requestData.oldPassword }
				});
		} catch (err) {
			return failureCONTENT(env, 'old password does not match!', 406)
		}
		await http.patch(
			`/api/users/${request.userid}/password`,
			{data: { "password": requestData.password }
			});
		return successEMPTY(env)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)	}
}
