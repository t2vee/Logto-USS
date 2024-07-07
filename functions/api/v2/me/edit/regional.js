// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { error, status } from '../../../../../api/libs/itty/responses';

export async function onRequestPost(ctx) {
    try {
        const requestData = await ctx.request.json();
        ctx.data.Validate.regional(requestData);
        await ctx.data.Http.patch(
            `/api/users/${ctx.userid}/profile`,
            {data: {
                    "profile": {
                        "address": {
                            "locality": requestData.timezone,
                            "country": requestData.country ? requestData.country : null,
                        }}}
            });
        return status(204)
    } catch (e) {
        console.error(e)
        return error(e)
    }
}