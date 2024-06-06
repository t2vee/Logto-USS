// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successCONTENT from "../../responses/raw/success-CONTENT";
import successEMPTY from "../../responses/raw/success-EMPTY";
import failureCONTENT from "../../responses/raw/failure-CONTENT";

import Filter from "bad-words";
const filter = new Filter();

export const handler = async (request, env, ctx) => {
	try {
		if (!request.params || !request.params.username) { return failureCONTENT(env, 'ERR_NO_USERNAME_PROVIDED', 400); }
		if (filter.isProfane(request.params.username)) { return failureCONTENT(env, 'ERR_USERNAME_CONTAINS_BAD_WORDS', 406) }
		const r = await ctx.Http.get(`/api/users?search=${encodeURIComponent(request.params.username)}`, {});
		return r === '[]' ?
			successEMPTY(env) :
			successCONTENT(env, '')
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)	}
}

