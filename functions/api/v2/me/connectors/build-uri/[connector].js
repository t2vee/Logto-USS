// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import {error, json} from '../../../../../../api/libs/itty/responses';

export async function onRequestPost(ctx) {
    try {
        if (!ctx.request.params || !ctx.request.params.connector) { return error(400, 'ERR_NO_TYPE_PROVIDED'); }
        const requestData = await ctx.request.json();
        const uriParams = {
            "state": Array.from(crypto.getRandomValues(new Uint32Array(ctx.userid.length)), dec => ('0' + dec.toString(16)).substr(-2)).join(''),
            "redirectUri": requestData.redirectUri,
        }
        const connectorResponse = await ctx.data.Http.get(`/api/connectors`, {});
        const connectorID = connectorResponse.find(item => item.target.toLowerCase() === ctx.request.params.connector.toLowerCase());
        const r = await ctx.data.Http.post(
            `/api/connectors/${connectorID.id}/authorization-uri`,
            {data: uriParams});
        return json(r)
    } catch (e) {
        console.error(e)
        return error(e)
    }
}