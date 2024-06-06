// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successEMPTY from "../../../../responses/raw/success-EMPTY";
import failureCONTENT from "../../../../responses/raw/failure-CONTENT";
import { MFAMethodsRouter } from './index'

MFAMethodsRouter.post("/remove", async (request, env, ctx) => {
	const uri = `/api/users/${ctx.userid}/mfa-verifications/`;
	try {
		const requestData = await request.json();
		await ctx.Http.delete(uri + requestData.appid, {});
		await ctx.Http.delete(uri + requestData.backupid, {});
		return successEMPTY(env)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)}
})
