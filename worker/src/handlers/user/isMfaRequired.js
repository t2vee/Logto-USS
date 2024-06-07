// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import { error, json } from 'itty-router'

export const handler = async (request, env, ctx) => {
	try {
		const value = await env.MFARequiredTokens.get(ctx.userid);
		return value
			? json({ status: false })
			: json({ status: true });
	} catch (e) {
		console.error(e)
		return error(418)
	}
}
