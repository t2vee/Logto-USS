// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import failureCONTENT from "../../../responses/raw/failure-CONTENT";
import successCONTENT from "../../../responses/raw/success-CONTENT";

export const handler = async (request, env, ctx) => {
	try {
		if (!request.params || !request.params.connector) { return failureCONTENT(env, 'ERR_NO_TYPE_PROVIDED', 400); }
		const requestData = await request.json();
		const uriParams = {
			"state": Array.from(crypto.getRandomValues(new Uint32Array(ctx.userid.length)), dec => ('0' + dec.toString(16)).substr(-2)).join(''),
			"redirectUri": requestData.redirectUri,
		}
		const connectorResponse = await ctx.Http.get(`/api/connectors`, {});
		const connectorID = connectorResponse.find(item => item.target.toLowerCase() === request.params.connector.toLowerCase());
		const r = await ctx.Http.post(
			`/api/connectors/${connectorID.id}/authorization-uri`,
			{data: uriParams});
		return successCONTENT(env, r)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)}
}
