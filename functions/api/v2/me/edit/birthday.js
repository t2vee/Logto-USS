// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { error, status } from '../../../../../api/libs/itty/responses';

export async function onRequestPost(ctx) {
    try {
        const requestData = await ctx.request.json();
        ctx.Validate.birthday(requestData);
        await ctx.Http.patch(
            `/api/users/${ctx.userid}/profile`,
            {data: {
                    "profile": {
                        "birthdate": requestData.birthday,
                    }}
            });
        return status(204)
    } catch (e) {
        console.error(e)
        return error(e)
    }
}