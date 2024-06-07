// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import { error, status } from 'itty-router'

export const handler = async (request, env, ctx) => {
	if (!request.params || !request.params.connector) { return error(400, 'ERR_NO_TYPE_PROVIDED'); }
	try {
		await ctx.Http.delete(
			`/api/users/${ctx.userid}/identities/${request.params.connector}`,
			{});
		return status(204)
	} catch (e) {
		console.error(e)
		return error(e)
}
}
