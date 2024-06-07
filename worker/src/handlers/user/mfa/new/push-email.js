// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import pushCode from "../../../../lib/pushCode";
import { error } from 'itty-router'

export default async (request, env, ctx) => {
	const requestData = await request.json();
	try {
		ctx.Validate.email(requestData);
	} catch (e) {
		console.error(e)
		return error(e)
	}
	const email = requestData.email;
	return pushCode(request, env, ctx, 'email', email);
}
