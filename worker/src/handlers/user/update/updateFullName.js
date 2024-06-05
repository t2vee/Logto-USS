// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureCONTENT from "../../../responses/raw/failure-CONTENT";

import Filter from "bad-words";
const filter = new Filter();

export default async (request, env, ctx) => {
	try {
		const requestData = await request.json();
		if (filter.isProfane(requestData.name)) {return failureCONTENT(env,'ERR_NAME_CONTAINS_BAD_WORDS', 406)}
		await ctx.Http.patch(
			`/api/users/${ctx.userid}`,
			{data: {"name": requestData.name}
			});
		return successEMPTY(env)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)	}
}
