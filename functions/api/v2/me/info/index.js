// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { error, json } from '../../../../../api/libs/itty/responses/index.js';

export async function onRequestGet(ctx) {
    const userData = await ctx.Http.get(
      `/api/users/${encodeURIComponent(ctx.userid)}`, {
          resTo400: 'ERR_USR_DOES_NOT_EXIST',
      });
    return json(userData);
}