// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successCONTENT from "../../responses/raw/content200";
import successEMPTY from "../../responses/raw/empty204";
import failureCONTENT from "../../responses/raw/content400";

import Filter from "bad-words";
const filter = new Filter();

export const handler = async (request, env, ctx) => {
	try {
		if (!request.params || !request.params.username) { return failureCONTENT('ERR_NO_USERNAME_PROVIDED', 400); }
		if (filter.isProfane(request.params.username)) { return failureCONTENT('ERR_USERNAME_CONTAINS_BAD_WORDS', 406) }
		const r = await ctx.Http.get(`/api/users?search=${encodeURIComponent(request.params.username)}`, {});
		return r === '[]' ?
			successEMPTY :
			successCONTENT('')
	} catch (e) {
		console.error(e)
		return failureCONTENT(e.message, e.status)	}
}

