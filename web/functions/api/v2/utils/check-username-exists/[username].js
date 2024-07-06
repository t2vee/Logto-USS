// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { status, error, json } from '../../../../../worker/libs/itty/responses';

import Filter from "bad-words";
const filter = new Filter();

export async function onRequestGet(ctx) {
    try {
        if (!ctx.request.params || !ctx.request.params.username) { return error(400, 'ERR_NO_USERNAME_PROVIDED'); }
        if (filter.isProfane(ctx.request.params.username)) { return error(406, 'ERR_USERNAME_CONTAINS_BAD_WORDS') }
        const r = await ctx.Http.get(`/api/users?search=${encodeURIComponent(ctx.request.params.username)}`, {});
        console.log(r)
        return r.length === 0 ? status(204) : json('')
    } catch (e) {
        console.error(e)
        return error(e)
    }
}
