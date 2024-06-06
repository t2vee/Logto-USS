// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import prepareNumber from "../utils/prepareNumber";
import successEMPTY from "../responses/raw/success-EMPTY";
import failureCONTENT from "../responses/raw/failure-CONTENT";

export default async (request, env, ctx, type, detail = undefined) => {
	try {
		if (!detail) {
			const userData = await ctx.Http.get(
				`/api/users/${encodeURIComponent(ctx.userid)}`, {
				});
			detail = type === 'email' ? userData.primaryEmail : await prepareNumber(userData.primaryPhone);
		}
		await ctx.Http.post(
			'/api/verification-codes',
			{
				data: type === 'email' ?
					{'email': detail}
				: {'phone': detail},
			});
		return successEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)
	}
}
