// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successEMPTY from "../../../../responses/raw/empty204";
import failureCONTENT from "../../../../responses/raw/content400";

export default async (request, env, ctx) => {
	try {
		await ctx.Http.patch(
			`/api/users/${ctx.userid}`,
			{data: {"primaryPhone": null}}
		);
		return successEMPTY
	} catch (e) {
		console.error(e)
		return failureCONTENT(e.message, e.status)	}
}
