// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureCONTENT from "../../../responses/raw/failure-CONTENT";
import { UpdateUserRouter } from './index'

UpdateUserRouter.post("/language", async (request, env, ctx) => {
	try {
		const requestData = await request.json();
		ctx.Validate.locale(requestData);
		await ctx.Http.patch(
			`/api/users/${ctx.userid}/profile`,
			{data: {
					"profile": {
						"locale": requestData.locale
					}}
			});
		return successEMPTY(env)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)	}
})
