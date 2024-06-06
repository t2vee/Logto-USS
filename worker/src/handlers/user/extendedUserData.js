// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successCONTENT from "../../responses/raw/success-CONTENT";
import failureCONTENT from "../../responses/raw/failure-CONTENT";

export const handler = async (request, env, ctx) => {
	try {
		const userData = await ctx.Http.get(
			`/api/users/${encodeURIComponent(ctx.userid)}`, {
				resTo400: 'ERR_USR_DOES_NOT_EXIST',
			});
		return successCONTENT(env, userData);
	} catch (e) {
		console.error('Error in grabbing User Data:' + e)
		return failureCONTENT(env, e.message, e.status)}
}

