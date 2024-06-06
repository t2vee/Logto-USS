// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successCONTENT from "../../responses/raw/content200";
import failureEMPTY from "../../responses/raw/empty400";

export const handler = async (request, env, ctx) => {
	try {
		const value = await env.MFARequiredTokens.get(ctx.userid);
		return value
			? successCONTENT({ status: false })
			: successCONTENT({ status: true });
	} catch (e) {
		console.error(e)
		return failureEMPTY(418)
	}
}
