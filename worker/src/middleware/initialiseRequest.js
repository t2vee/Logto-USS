// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import DataValidator from '../lib/DataValidator'
import { createHttpClient } from '../HttpClient'

export default async (req, env, ctx) => {
	try {
		ctx.Validate = new DataValidator(env, req)
		ctx.Http = createHttpClient(env, ctx.accesstoken)
	} catch (e) {

	}
	console.log('[MIDDLEWARE] API Request Initialised');
}
