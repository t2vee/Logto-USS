// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import successEMPTY from "../responses/raw/success-EMPTY";
import failureCONTENT from "../responses/raw/failure-CONTENT";
import prepareNumber from "../utils/prepareNumber";

export default async (env, request, ctx, type, detail = undefined) => {
	try {
		if (!detail) {
			const userData = await ctx.Http.get(
				`/api/users/${encodeURIComponent(ctx.userid)}`, {
				});
			detail = type === 'email' ? userData.primaryEmail : await prepareNumber(userData.primaryPhone);
		}
		await ctx.Http.post(
			'/api/verification-codes/verify',
			{
				data: type === 'email' ?
					{'email': detail, "verificationCode": ctx.verificationCode}
					: {'phone': detail, "verificationCode": ctx.verificationCode},
			});
		await env.MFARequiredTokens.put(ctx.userid, false, {expirationTtl: 900});
		return successEMPTY(env)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)
	}
}
