// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import verifyCode from "../../../lib/verifyCode";

export default async (request, env) => {
	return verifyCode(env, request, 'phone')
}
