// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successEMPTY from "../../../responses/empty204";
import failureCONTENT from "../../../responses/content400";

export const handler = async (request, env, ctx) => {
	try {
		await ctx.Http.patch(`/api/users/${ctx.userid}/is-suspended`, {
			body: {"isSuspended": true},
		})
		return successEMPTY
	} catch (e) {
		console.error(e)
		return failureCONTENT(e.message, e.status)}
}
