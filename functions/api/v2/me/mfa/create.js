// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { error, json } from '../../../../../api/libs/itty/responses';

export async function onRequestGet(ctx) {
    try {
        const uri = `/api/users/${ctx.data.userid}/mfa-verifications`
        const totp = await ctx.data.Http.post(uri, {data: {"type": "Totp"},});
        const code = await ctx.data.Http.post(uri, {data: {"type": "BackupCode"},});
        return json({
            "AppAuthenticator": totp,
            "BackupCodes": code,
        });
    } catch (e) {
        console.error(e)
        return error(e)
    }
}