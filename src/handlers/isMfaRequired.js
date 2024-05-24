// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successCONTENT from "../responses/raw/success-CONTENT";
import failureEMPTY from "../responses/raw/failure-EMPTY";

export default async (request, env) => {
	try {
		const value = await env.MFARequiredTokens.get(request.userid);
		return value
			? successCONTENT(env, { status: false })
			: successCONTENT(env, { status: true });
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 418)
	}
}
