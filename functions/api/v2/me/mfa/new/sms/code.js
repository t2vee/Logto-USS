// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import verifyCode from "../../../../../../../api/libs/verifyCode.js";
import { error, status } from '../../../../../../../api/libs/itty/responses';

export async function onRequestPost(ctx) {
    try {
        const requestData = await ctx.request.json();
        ctx.Validate.phone(requestData);
        const phone = requestData.encryptedPhoneNumber;
        try {
            await verifyCode(ctx.env, ctx.request, ctx, 'phone', phone)
        } catch (e) {
            console.error(e)
            return error(e)
        }
        await ctx.http.patch(
            `/api/users/${ctx.userid}`,
            {
                data: {"primaryPhone": phone},
                resTo400: 'ERR_INVALID_NUM',
            }
        );
        return status(204)
    } catch (e) {
        console.error(e)
        return error(e)
    }
}