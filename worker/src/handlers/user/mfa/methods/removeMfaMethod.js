// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import { error, status } from 'itty-router'

export default async (request, env, ctx) => {
	const uri = `/api/users/${ctx.userid}/mfa-verifications/`;
	try {
		const requestData = await request.json();
		await ctx.Http.delete(uri + requestData.appid, {});
		await ctx.Http.delete(uri + requestData.backupid, {});
		return status(204)
	} catch (e) {
		console.error(e)
		return error(e)
	}
}
