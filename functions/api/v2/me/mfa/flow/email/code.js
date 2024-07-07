// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import verifyCode from "../../../../../../../api/libs/verifyCode.js";
import { error, status } from '../../../../../../../api/libs/itty/responses/index.js'

export async function onRequestPost(ctx) {
    try {
        await verifyCode(ctx, 'email')
        await ctx.env.MfaStatus.put(ctx.data.userid, false, {expirationTtl: 900});
        return status(204)
    } catch (e) {
        console.error(e)
        return error(e)
    }
}