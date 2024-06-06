// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import failureEMPTY from "../../responses/raw/empty400";
import successCONTENT from "../../responses/raw/content200";
import successEMPTY from "../../responses/raw/empty204";

export const handler = async (request, env, ctx) => {
	try {
		const value = await env.UsernameChangeTimelimit.get(ctx.userid);
		return value
			? successCONTENT({value})
			: successEMPTY;
	} catch (e) {
		console.error(e)
		return failureEMPTY(418)
	}
}

