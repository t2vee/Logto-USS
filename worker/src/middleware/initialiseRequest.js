// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import { createDataValidator } from '../lib/DataValidator'

export default async (req, env) => {
	try {
		req.Validate = createDataValidator(env)
	} catch (e) {

	}
	console.log('[MIDDLEWARE] API Request Initialised');
}
