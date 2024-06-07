// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import { error, status } from 'itty-router'

export const handler = async (request, env, ctx) => {
	try {
		await ctx.Http.patch(`/api/users/${ctx.userid}/is-suspended`, {
			body: {"isSuspended": true},
		})
		return status(204)
	} catch (e) {
		console.error(e)
		return error(e)
}
}
