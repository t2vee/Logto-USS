// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successCONTENT from "../../../../responses/raw/success-CONTENT";
import failureCONTENT from "../../../../responses/raw/failure-CONTENT";
import { MFAMethodsRouter } from './index'

MFAMethodsRouter.post("/create", async (request, env, ctx) => {
	try {
		const uri = `/api/users/${ctx.userid}/mfa-verifications`
		const totp = await ctx.Http.post(uri, {data: {"type": "Totp"},});
		const code = await ctx.Http.post(uri, {data: {"type": "BackupCode"},});
		return successCONTENT(env, {
			"AppAuthenticator": totp,
			"BackupCodes": code,
		});
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)}
})
