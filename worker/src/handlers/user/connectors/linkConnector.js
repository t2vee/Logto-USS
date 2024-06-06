// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import failureCONTENT from "../../../responses/raw/content400";
import successCONTENT from "../../../responses/raw/content200";
import { ConnectorRouter } from './index'


export const handler = async (request, env, ctx) => {
	try {
		if (!request.params || !request.params.connector) { return failureCONTENT('ERR_NO_TYPE_PROVIDED', 400); }
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
		return successCONTENT(r);
	} catch (e) {
		console.error(e)
		return failureCONTENT(e.message, e.status)}
}
