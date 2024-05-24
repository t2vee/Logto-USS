// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import failureEMPTY from "../../responses/raw/failure-EMPTY";
import failureCONTENT from "../../responses/raw/failure-CONTENT";
import grabConnectorIds from "../../lib/grabConnectorIds";
import linkNewUserConnector from "../../lib/linkNewUserConnector";
import successCONTENT from "../../responses/raw/success-CONTENT";

export default async (request, env) => {
	try {
		if (!request.params || !request.params.connector) { return failureCONTENT(env, 'No Connector Type Provided', 400); }
		const requestData = await request.json();
		const connectorResponse = await grabConnectorIds(env, request.accesstoken);
		const connectorID = connectorResponse.find(item => item.target.toLowerCase() === request.params.connector.toLowerCase());
		const uriParams = {
			"connectorId": connectorID.id,
			"connectorData": requestData.connectorData,
		}
		const linkResponse = await linkNewUserConnector(env, request.accesstoken, uriParams, request.userid)
		return linkResponse.status === 200
			? successCONTENT(env, await linkResponse.json())
			: failureEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 418)
	}
}
