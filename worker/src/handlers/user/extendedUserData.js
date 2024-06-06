// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successCONTENT from "../../responses/content200";
import failureCONTENT from "../../responses/content400";

export const handler = async (request, env, ctx) => {
	try {
		const userData = await ctx.Http.get(
			`/api/users/${encodeURIComponent(ctx.userid)}`, {
				resTo400: 'ERR_USR_DOES_NOT_EXIST',
			});
		return successCONTENT(userData);
	} catch (e) {
		console.error('Error in grabbing User Data:' + e)
		return failureCONTENT(e.message, e.status)}
}
