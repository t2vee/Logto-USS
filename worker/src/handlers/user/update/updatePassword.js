// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successEMPTY from "../../../responses/raw/empty204";
import failureCONTENT from "../../../responses/raw/content400";
import { UpdateUserRouter } from './index'

export const handler = async (request, env, ctx) => {
	try {
		const requestData = await request.json();
		ctx.Validate.password(requestData);
		try {
			await ctx.Http.post(
				`/api/users/${ctx.userid}/password/verify`,
				{data: { "password": requestData.oldPassword }
				});
		} catch (err) {
			return failureCONTENT('old password does not match!', 406)
		}
		await ctx.Http.patch(
			`/api/users/${ctx.userid}/password`,
			{data: { "password": requestData.password }
			});
		return successEMPTY
	} catch (e) {
		console.error(e)
		return failureCONTENT(e.message, e.status)	}
}
