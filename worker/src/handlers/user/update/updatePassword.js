// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureCONTENT from "../../../responses/raw/failure-CONTENT";

export default async (request, env, ctx) => {
	try {
		const requestData = await request.json();
	  request.Validate.password(requestData);
		try {
			await ctx.Http.post(
				`/api/users/${ctx.userid}/password/verify`,
				{data: { "password": requestData.oldPassword }
				});
		} catch (err) {
			return failureCONTENT(env, 'old password does not match!', 406)
		}
		await ctx.Http.patch(
			`/api/users/${ctx.userid}/password`,
			{data: { "password": requestData.password }
			});
		return successEMPTY(env)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)	}
}
