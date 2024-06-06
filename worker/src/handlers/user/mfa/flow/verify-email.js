// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import verifyCode from "../../../../lib/verifyCode";

export const handler = async (request, env, ctx) => {
	return verifyCode(env, request, ctx, 'email')
}
