// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { error, json } from '../../../../../api/libs/itty/responses/index.js';

export async function onRequestGet(ctx) {
    try {
        const value = await ctx.env.MfaStatus.get(ctx.data.userid);
        return value
            ? json({ status: false })
            : json({ status: true });
    } catch (e) {
        console.error(e)
        return error(418)
    }
}