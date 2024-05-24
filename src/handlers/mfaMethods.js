// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license. 


import grabMFAMethods from "../lib/mfa/grabMFAMethods";
import successCONTENT from "../responses/raw/success-CONTENT";
import failureEMPTY from "../responses/raw/failure-EMPTY";

export default async (request, env) => {
	try {
		const resourceResponse = await grabMFAMethods(env, request.accesstoken, request.userid);
		if (JSON.stringify(resourceResponse) === '[]') {
			return successCONTENT(env, ["none"]);
		} else {
			return successCONTENT(env, resourceResponse);
		}
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 418)
	}
}
