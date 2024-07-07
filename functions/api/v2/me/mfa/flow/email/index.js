// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import pushCode from "../../../../../../../api/libs/pushCode.js";

export async function onRequestPost(ctx) {
    return pushCode(ctx.request, ctx.env, ctx, 'email');
}