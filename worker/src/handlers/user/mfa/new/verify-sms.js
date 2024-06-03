// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import successEMPTY from "../../../../responses/raw/success-EMPTY";
import verifyCode from "../../../../lib/verifyCode";
import {createHttpClient} from "../../../../HttpClient";
import failureCONTENT from "../../../../responses/raw/failure-CONTENT";

export default async (request, env) => {
	try {
		const requestData = await request.json();
		request.validator.phone(requestData);
		const phone = requestData.encryptedPhoneNumber;
		try {
			await verifyCode(env, request, 'phone', phone)
		} catch (e) {
			console.error(e)
			return failureCONTENT(env, e.message, e.status)}
		const http = createHttpClient(env, request.accesstoken);
		await http.patch(
			`/api/users/${request.userid}`,
			{
				data: {"primaryPhone": phone},
				resTo400: 'ERR_INVALID_NUM',
			}
		);
		return successEMPTY(env)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)	}
}
