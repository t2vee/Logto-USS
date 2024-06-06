// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successCONTENT from "../../responses/raw/success-CONTENT";
import failureEMPTY from "../../responses/raw/failure-EMPTY";
import { UserRouter } from './index'

UserRouter.get("is-mfa-required", async (request, env, ctx) => {
	try {
		const value = await env.MFARequiredTokens.get(ctx.userid);
		return value
			? successCONTENT(env, { status: false })
			: successCONTENT(env, { status: true });
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 418)
	}
})
