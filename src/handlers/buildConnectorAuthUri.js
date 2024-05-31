// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import failureCONTENT from "../responses/raw/failure-CONTENT";
import successCONTENT from "../responses/raw/success-CONTENT";
import {createHttpClient} from "../HttpClient";

export default async (request, env) => {
	try {
		if (!request.params || !request.params.connector) { return failureCONTENT(env, 'ERR_NO_TYPE_PROVIDED', 400); }
		const requestData = await request.json();
		const http = createHttpClient(env, request.accesstoken);
		const uriParams = {
			"state": Array.from(crypto.getRandomValues(new Uint32Array(request.userid.length)), dec => ('0' + dec.toString(16)).substr(-2)).join(''),
			"redirectUri": requestData.redirectUri,
		}
		const connectorResponse = await http.get(`/api/connectors`, {});
		const connectorID = connectorResponse.find(item => item.target.toLowerCase() === request.params.connector.toLowerCase());
		const r = await http.post(
			`/api/connectors/${connectorID.id}/authorization-uri`,
			{data: uriParams});
		return successCONTENT(env, r)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)}
}
