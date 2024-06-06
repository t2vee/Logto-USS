// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import failureCONTENT from "../../../responses/raw/failure-CONTENT";
import successCONTENT from "../../../responses/raw/success-CONTENT";
import { ConnectorRouter } from './index'

ConnectorRouter.post("/link/:connector", async (request, env, ctx) => {
	try {
		if (!request.params || !request.params.connector) { return failureCONTENT(env, 'ERR_NO_TYPE_PROVIDED', 400); }
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
		return successCONTENT(env, r);
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)}
})
