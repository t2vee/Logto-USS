// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import successEMPTY from "../responses/empty204";
import failureCONTENT from "../responses/content400";
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
		return successEMPTY
	} catch (e) {
		console.error(e)
		return failureCONTENT(e.message, e.status)
	}
}
