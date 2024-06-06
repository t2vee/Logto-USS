// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successCONTENT from "../../../../responses/content200";
import failureCONTENT from "../../../../responses/content400";


export default async (request, env, ctx) => {
	try {
		const uri = `/api/users/${ctx.userid}/mfa-verifications`
		const totp = await ctx.Http.post(uri, {data: {"type": "Totp"},});
		const code = await ctx.Http.post(uri, {data: {"type": "BackupCode"},});
		return successCONTENT({
			"AppAuthenticator": totp,
			"BackupCodes": code,
		});
	} catch (e) {
		console.error(e)
		return failureCONTENT(e.message, e.status)}
}
