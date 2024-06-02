// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import {createHttpClient} from "../HttpClient";
import successEMPTY from "../responses/raw/success-EMPTY";
import failureCONTENT from "../responses/raw/failure-CONTENT";
import prepareNumber from "../utils/prepareNumber";

export default async (env, request, type, detail = undefined) => {
	try {
		const http = createHttpClient(env, request.accesstoken);
		if (!detail) {
			const userData = await http.get(
				`/api/users/${encodeURIComponent(request.userid)}`, {
				});
			detail = type === 'email' ? userData.primaryEmail : await prepareNumber(userData.primaryPhone);
		}
		await http.post(
			'/api/verification-codes/verify',
			{
				data: type === 'email' ?
					{'email': detail, "verificationCode": request.verificationCode}
					: {'phone': detail, "verificationCode": request.verificationCode},
			});
		await env.MFARequiredTokens.put(request.userid, false, {expirationTtl: 900});
		return successEMPTY(env)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)
	}
}
