// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { error, status } from '../../../../../api/libs/itty/responses';

export async function onRequestGet(ctx) {
    try {
        const uri = `/api/users/${ctx.userid}/mfa-verifications/`;
        const requestData = await ctx.request.json();
        await ctx.http.delete(uri + requestData.appid, {});
        await ctx.http.delete(uri + requestData.backupid, {});
        return status(204)
    } catch (e) {
        console.error(e)
        return error(e)
    }
}