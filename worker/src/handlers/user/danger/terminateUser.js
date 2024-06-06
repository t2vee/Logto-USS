// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureCONTENT from "../../../responses/raw/failure-CONTENT";
import { DangerZoneRouter } from './index'

DangerZoneRouter.post("/terminate", async (request, env, ctx) => {
	try {
		await ctx.Http.delete(`/api/users/${ctx.userid}`, {})
		return successEMPTY(env)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)}
})
