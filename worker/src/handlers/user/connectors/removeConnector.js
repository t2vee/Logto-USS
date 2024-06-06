// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureCONTENT from "../../../responses/raw/failure-CONTENT";
import { ConnectorRouter } from './index'

ConnectorRouter.post("/remove/:connector", async (request, env, ctx) => {
	if (!request.params || !request.params.connector) { return failureCONTENT(env, 'ERR_NO_TYPE_PROVIDED', 400); }
	try {
		await ctx.Http.delete(
			`/api/users/${ctx.userid}/identities/${request.params.connector}`,
			{});
		return successEMPTY(env)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)}
})
