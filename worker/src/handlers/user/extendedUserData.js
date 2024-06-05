// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successCONTENT from "../../responses/raw/success-CONTENT";
import failureCONTENT from "../../responses/raw/failure-CONTENT";

export default async (request, env, ctx) => {
	try {
		const userData = await ctx.Http.get(
			`/api/users/${encodeURIComponent(ctx.userid)}`, {
				resTo400: 'ERR_USR_DOES_NOT_EXIST',
			});
		return successCONTENT(env, userData);
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)}
}
