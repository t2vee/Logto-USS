// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successCONTENT from "../../../../responses/raw/success-CONTENT";
import failureCONTENT from "../../../../responses/raw/failure-CONTENT";
import { MFAMethodsRouter } from './index'

MFAMethodsRouter.post("/methods", async (request, env, ctx) => {
	try {
		const r = await ctx.Http.get(`/api/users/${encodeURIComponent(ctx.userid)}/mfa-verifications`, {});
		return r.length === 0 ?
			successCONTENT(env, ["none"]) :
			successCONTENT(env, r)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)	}
})
