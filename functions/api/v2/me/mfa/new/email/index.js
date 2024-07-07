// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import pushCode from "../../../../../../../api/libs/pushCode.js";
import { error } from '../../../../../../../api/libs/itty/responses';

export async function onRequestPost(ctx) {
    const requestData = await ctx.request.json();
    try {
        ctx.Validate.email(requestData);
    } catch (e) {
        console.error(e)
        return error(e)
    }
    const email = requestData.email;
    return pushCode(ctx.request, ctx.env, ctx, 'email', email);
}