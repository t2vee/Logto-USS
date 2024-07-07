// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { error, json } from '../../../../api/libs/itty/responses';

export async function onRequestGet(ctx) {
  try {
    const response = await ctx.data.Http.get(`/api/connectors`, {});
    const mappedPayload = response.map(item => ({
      id: item.id,
      connectorId: item.connectorId,
      target: item.target,
      name: item.name,
      logo: item.logo,
    }));
    return json(mappedPayload);
  } catch (e) {
    console.error(e)
    return error(e)
  }
}
