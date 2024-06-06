// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successEMPTY from "../../../../responses/raw/success-EMPTY";
import failureCONTENT from "../../../../responses/raw/failure-CONTENT";
import { UpdateUserRouter } from '../../update'

UpdateUserRouter.post("/remove-sms", async (request, env, ctx) => {
	try {
		await ctx.Http.patch(
			`/api/users/${ctx.userid}`,
			{data: {"primaryPhone": null}}
		);
		return successEMPTY(env)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)	}
})

