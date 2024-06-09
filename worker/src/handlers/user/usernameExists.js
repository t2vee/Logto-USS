// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import { status, error, json } from 'itty-router';

import Filter from "bad-words";
const filter = new Filter();

export const handler = async (request, env, ctx) => {
	try {
		if (!request.params || !request.params.username) { return error(400, 'ERR_NO_USERNAME_PROVIDED'); }
		if (filter.isProfane(request.params.username)) { return error(406, 'ERR_USERNAME_CONTAINS_BAD_WORDS') }
		const r = await ctx.Http.get(`/api/users?search=${encodeURIComponent(request.params.username)}`, {});
		console.log(r)
		return r.length === 0 ? status(204) : json('')
	} catch (e) {
		console.error(e)
		return error(e)
	}
}

