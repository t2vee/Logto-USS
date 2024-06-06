// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import successEMPTY from "../../../responses/raw/empty204";
import failureCONTENT from "../../../responses/raw/content400";
import { DangerZoneRouter } from './index'


export const handler = async (request, env, ctx) => {
	try {
		await ctx.Http.delete(`/api/users/${ctx.userid}`, {})
		return successEMPTY
	} catch (e) {
		console.error(e)
		return failureCONTENT(e.message, e.status)}
}
