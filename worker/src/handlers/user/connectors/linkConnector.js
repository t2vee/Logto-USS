// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import { error, json } from 'itty-router'

export const handler = async (request, env, ctx) => {
	try {
		if (!request.params || !request.params.connector) { return error(400, 'ERR_NO_TYPE_PROVIDED'); }
		const requestData = await request.json();
		const connectorResponse = await ctx.Http.get(`/api/connectors`, {});
		const connectorID = connectorResponse.find(item => item.target.toLowerCase() === request.params.connector.toLowerCase());
		const uriParams = {
			"connectorId": connectorID.id,
			"connectorData": requestData.connectorData,
		}
		const r = await ctx.Http.post(
			`/api/users/${ctx.userid}/identities`,
			{data: uriParams});
		return json(r);
	} catch (e) {
		console.error(e)
		return error(e)}
}
