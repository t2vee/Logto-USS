// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { error, status } from '../libs/itty/responses';
import prepareNumber from "../utils/prepareNumber";

export default async (env, request, ctx, type, detail = undefined) => {
	try {
		if (!detail) {
			const userData = await ctx.data.Http.get(
				`/api/users/${encodeURIComponent(ctx.data.userid)}`, {
				});
			detail = type === 'email' ? userData.primaryEmail : await prepareNumber(userData.primaryPhone);
		}
		await ctx.data.Http.post(
			'/api/verification-codes/verify',
			{
				data: type === 'email' ?
					{'email': detail, "verificationCode": ctx.data.verificationCode}
					: {'phone': detail, "verificationCode": ctx.data.verificationCode},
			});
		await env.MFARequiredTokens.put(ctx.data.userid, false, {expirationTtl: 9000});
		return status(204)
	} catch (e) {
		console.error(e)
		return error(e)
	}
}
