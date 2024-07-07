// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import verifyCode from "../../../../../../../api/libs/verifyCode.js";
import { error, status } from '../../../../../../../api/libs/itty/responses';

export async function onRequestPost(ctx) {
    try {
        const requestData = await ctx.request.json();
        ctx.Validate.email(requestData);
        try {
            await verifyCode(ctx.env, ctx.request, ctx, 'email', requestData.email)
        } catch (e) {
            console.error(e)
            return error(e)
        }
        await ctx.http.patch(
            `/api/users/${ctx.userid}`,
            {
                data: {"primaryEmail": requestData.email},
                resTo400: 'ERR_INVALID_EMAIL',
            }
        );
        return status(204)
    } catch (e) {
        console.error(e)
        return error(e)
    }
}