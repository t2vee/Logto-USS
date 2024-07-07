// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import {error, status} from '../../../../../../api/libs/itty/responses';

export async function onRequestPost(ctx) {
    if (!ctx.params || !ctx.params.connector) { return error(400, 'ERR_NO_TYPE_PROVIDED'); }
    try {
        await ctx.data.Http.delete(
            `/api/users/${ctx.data.userid}/identities/${ctx.params.connector}`,
            {});
        return status(204)
    } catch (e) {
        console.error(e)
        return error(e)
    }
}