// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import { status, json, error } from 'itty-router';

export const handler = async (request, env, ctx) => {
	try {
		const value = await env.UsernameChangeTimelimit_DEMO.get(ctx.userid);
		return value ? json({value}) : status(204);
	} catch (e) {
		console.error(e)
		return error(418)
	}
}

