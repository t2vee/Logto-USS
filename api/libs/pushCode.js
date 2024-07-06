// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import prepareNumber from "../utils/prepareNumber";
import { status, error } from 'itty-router';

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
		return status(204);
	} catch (e) {
		console.error(e)
		return error(e)
	}
}
