// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import {error, json} from "itty-router";

export const handler = async (request, env, ctx) => {
	try {
		const userData = await ctx.Http.get(
			`/api/users/${encodeURIComponent(ctx.userid)}`, {
				resTo400: 'ERR_USR_DOES_NOT_EXIST',
			});
		console.log('User ID:', userData.sub)
		return json(userData);
	} catch (e) {
		console.error('Error in grabbing User Data:' + e)
		return error(e)
	}
}
