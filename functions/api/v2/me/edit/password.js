// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { error, status } from '../../../../../api/libs/itty/responses';

export async function onRequestPost(ctx) {
    try {
        const requestData = await ctx.request.json();
        ctx.Validate.password(requestData);
        try {
            await ctx.Http.post(
                `/api/users/${ctx.userid}/password/verify`,
                {data: { "password": requestData.oldPassword }
                });
        } catch (err) {
            return error(406,'old password does not match!')
        }
        await ctx.Http.patch(
            `/api/users/${ctx.userid}/password`,
            {data: { "password": requestData.password }
            });
        return status(204)
    } catch (e) {
        console.error(e)
        return error(e)
    }
}