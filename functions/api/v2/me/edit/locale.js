// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { error, status } from '../../../../../api/libs/itty/responses';

export async function onRequestPost(ctx) {
    try {
        const requestData = await ctx.request.json();
        ctx.data.Validate.locale(requestData);
        await ctx.data.Http.patch(
            `/api/users/${ctx.data.userid}/profile`,
            {data: {
                    "profile": {
                        "locale": requestData.locale
                    }}
            });
        return status(204)
    } catch (e) {
        console.error(e)
        return error(e)
    }
}