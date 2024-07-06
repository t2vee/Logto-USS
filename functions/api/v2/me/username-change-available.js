// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { status, error, json } from '../../../../api/libs/itty/responses';

export async function onRequestGet(ctx) {
    try {
        const value = await ctx.env.UsernameChangeTimelimit.get(ctx.userid);
        return value ? json({value}) : status(204);
    } catch (e) {
        console.error(e)
        return error(418)
    }
}