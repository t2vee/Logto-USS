// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import { error, status } from 'itty-router'

export const handler = async (request, env, ctx) => {
	try {
		const requestData = await request.json();
		ctx.Validate.username(requestData);
		if (await env.UsernameChangeTimelimit.get(ctx.userid)) {return error(400, `ERR_CANNOT_YET_CHANGE`)}
		await ctx.Http.patch(
			`/api/users/${ctx.userid}`,
			{data: {"username": requestData.username}
			});
		const monthFromNow = Math.floor(new Date(new Date().setMonth(new Date().getMonth() + 1)).getTime() / 1000);
		const formattedDate = new Date(monthFromNow * 1000)
		await env.UsernameChangeTimelimit.put(ctx.userid, [('0' + formattedDate.getDate()).slice(-2), ('0' + (formattedDate.getMonth() + 1)).slice(-2), formattedDate.getFullYear().toString().slice(-2)].join('/'), {expirationTtl: monthFromNow})
		return status(204)
	} catch (e) {
		console.error(e)
		return error(e)
	}
}
