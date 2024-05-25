// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import {createHttpClient} from "../HttpClient";
import prepareNumber from "../utils/prepareNumber";
import successEMPTY from "../responses/raw/success-EMPTY";
import failureCONTENT from "../responses/raw/failure-CONTENT";

// reducing extreme boilerplate
export default async (env, request, type, detail = undefined) => {
	try {
		const http = createHttpClient(env, request.accesstoken);
		if (detail) {
			const userData = await http.get(
				`/api/users/${encodeURIComponent(request.userid)}`, {
				});
			detail = type === 'email' ? detail : await prepareNumber(userData.primaryPhone);
		}
		await http.post(
			'/api/verification-codes',
			{
				data: {
					type: detail,
				}
			}
		);
		return successEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)
	}
}
