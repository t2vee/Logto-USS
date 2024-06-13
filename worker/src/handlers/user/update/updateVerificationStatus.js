// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import {error, json, status} from 'itty-router'

export const handler = async (request, env, ctx) => {
	try {
		const requestData = await request.json();
		ctx.Validate.developer(requestData);
		await ctx.Http.patch(
			`/api/users/${ctx.userid}/custom-data`,
			{data: { "customData": {"loginVerification": requestData.enable ? 'enabled' : 'disabled' } }
			});
		if (requestData.enable) {
			await env.MFARequiredTokens.delete(ctx.userid);
		} else {
			await env.MFARequiredTokens.put(ctx.userid, false);
		}
		return requestData.enable ? status(204) : json('')
	} catch (e) {
		console.error(e)
		return error(e)
	}
}
