// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import prepareNumber from "../utils/prepareNumber";
import { error, status } from '../libs/itty/responses';

export default async (request, env, ctx, type, detail = undefined) => {
	try {
		if (!detail) {
			const userData = await ctx.data.Http.get(
				`/api/users/${encodeURIComponent(ctx.data.userid)}`, {
				});
			detail = type === 'email' ? userData.primaryEmail : await prepareNumber(userData.primaryPhone);
		}
		await ctx.data.Http.post(
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
