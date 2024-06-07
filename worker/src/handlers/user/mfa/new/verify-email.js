// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import {error, status} from 'itty-router';
import verifyCode from "../../../../lib/verifyCode";

export default async (request, env, ctx) => {
	try {
		const requestData = await request.json();
		ctx.Validate.email(requestData);
		try {
			await verifyCode(env, request, ctx, 'email', requestData.email)
		} catch (e) {
			console.error(e)
			return error(e)
		}
		await ctx.Http.patch(
			`/api/users/${ctx.userid}`,
			{
				data: {"primaryEmail": requestData.email},
				resTo400: 'ERR_INVALID_EMAIL',
			}
		);
		return status(204)
	} catch (e) {
		console.error(e)
		return error(e)
	}
}
