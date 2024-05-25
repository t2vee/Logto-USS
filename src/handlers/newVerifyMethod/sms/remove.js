// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successEMPTY from "../../../responses/raw/success-EMPTY";
import {createHttpClient} from "../../../HttpClient";
import failureCONTENT from "../../../responses/raw/failure-CONTENT";

export default  async (request, env) => {
	try {
		const http = createHttpClient(env, request.accesstoken);
		await http.patch(
			`/api/users/${request.userid}`,
			{
				data: {"primaryPhone": null},
			}
		);
		return successEMPTY(env)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)	}
}

