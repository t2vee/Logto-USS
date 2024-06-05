// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import { createDataValidator } from '../lib/DataValidator'
import { createHttpClient } from '../HttpClient'

export default async (req, env, ctx) => {
	try {
		ctx.Validate = createDataValidator(env)
		ctx.Http = createHttpClient(env, ctx.accesstoken)
	} catch (e) {

	}
	console.log('[MIDDLEWARE] Request Context Initialised');
}
