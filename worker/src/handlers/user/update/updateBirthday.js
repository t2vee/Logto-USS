// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureCONTENT from "../../../responses/raw/failure-CONTENT";
import { UpdateUserRouter } from './index'


UpdateUserRouter.post("/birthday", async (request, env, ctx) => {
	try {
		const requestData = await request.json();
		ctx.Validate.birthday(requestData);
		await ctx.Http.patch(
			`/api/users/${ctx.userid}/profile`,
			{data: {
					"profile": {
						"birthdate": requestData.birthday,
					}}
			});
		return successEMPTY(env)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)	}
})
