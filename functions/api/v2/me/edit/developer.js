// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { error, status, json } from '../../../../../api/libs/itty/responses';

export async function onRequestPost(ctx) {
    try {
        const requestData = await ctx.request.json();
        ctx.Validate.developer(requestData);
        await ctx.http.patch(
            `/api/users/${ctx.userid}/custom-data`,
            {data: { "customData": {"developer": requestData.enable } }
            });
        return requestData.enable ? status(204) : json('')
    } catch (e) {
        console.error(e)
        return error(e)
    }
}