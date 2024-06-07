// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import { status } from 'itty-router';
import { error } from 'itty-router'

export default async (request, env, ctx) => {
	try {
		await ctx.Http.patch(
			`/api/users/${ctx.userid}`,
			{data: {"primaryPhone": null}}
		);
		return status(204)
	} catch (e) {
		console.error(e)
		return error(e)
	}
}
