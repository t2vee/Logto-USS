// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successCONTENT from "../../../../responses/content200";
import failureCONTENT from "../../../../responses/content400";

export default async (request, env, ctx) => {
	try {
		const r = await ctx.Http.get(`/api/users/${encodeURIComponent(ctx.userid)}/mfa-verifications`, {});
		return r.length === 0 ?
			successCONTENT(["none"]) :
			successCONTENT(r)
	} catch (e) {
		console.error(e)
		return failureCONTENT(e.message, e.status)	}
}
