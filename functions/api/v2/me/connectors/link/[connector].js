// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import {error, json} from '../../../../../../api/libs/itty/responses';

export async function onRequestPost(ctx) {
    try {
        if (!ctx.request.params || !ctx.request.params.connector) { return error(400, 'ERR_NO_TYPE_PROVIDED'); }
        const requestData = await ctx.request.json();
        const connectorResponse = await ctx.http.get(`/api/connectors`, {});
        const connectorID = connectorResponse.find(item => item.target.toLowerCase() === ctx.request.params.connector.toLowerCase());
        const uriParams = {
            "connectorId": connectorID.id,
            "connectorData": requestData.connectorData,
        }
        const r = await ctx.http.post(
            `/api/users/${ctx.userid}/identities`,
            {data: uriParams});
        return json(r);
    } catch (e) {
        console.error(e)
        return error(e)
    }
}