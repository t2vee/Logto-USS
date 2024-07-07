// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { error, status } from '../libs/itty/responses';
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
		await env.MFARequiredTokens.put(ctx.userid, false, {expirationTtl: 9000});
		return status(204)
	} catch (e) {
		console.error(e)
		return error(e)
	}
}
