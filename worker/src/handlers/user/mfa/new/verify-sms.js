// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { status, error } from 'itty-router';
import verifyCode from "../../../../lib/verifyCode";

export default async (request, env, ctx) => {
	try {
		const requestData = await request.json();
		ctx.Validate.phone(requestData);
		const phone = requestData.encryptedPhoneNumber;
		try {
			await verifyCode(env, request, ctx, 'phone', phone)
		} catch (e) {
			console.error(e)
			return error(e)
}
		await ctx.Http.patch(
			`/api/users/${ctx.userid}`,
			{
				data: {"primaryPhone": phone},
				resTo400: 'ERR_INVALID_NUM',
			}
		);
		return status(204)
	} catch (e) {
		console.error(e)
		return error(e)
	}
}
