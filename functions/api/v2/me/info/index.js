// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { error, json } from '../../../../../api/libs/itty/responses/index.js';

export async function onRequest(ctx) {
    console.log(1)
    const userData = await ctx.Http.get(
      `/api/users/${encodeURIComponent(ctx.userid)}`, {
          resTo400: 'ERR_USR_DOES_NOT_EXIST',
      });
    console.log(10)
    return json(userData);
}