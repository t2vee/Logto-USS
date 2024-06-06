// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successEMPTY from "../../../responses/empty204";
import failureCONTENT from "../../../responses/content400";

export const handler = async (request, env, ctx) => {
	if (!request.params || !request.params.connector) { return failureCONTENT('ERR_NO_TYPE_PROVIDED', 400); }
	try {
		await ctx.Http.delete(
			`/api/users/${ctx.userid}/identities/${request.params.connector}`,
			{});
		return successEMPTY
	} catch (e) {
		console.error(e)
		return failureCONTENT(e.message, e.status)}
}
