// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import { error } from 'itty-router'

export default async (request, env, ctx) => {
	const url = new URL(request.url);
	const verificationCode = url.searchParams.get('verification-code');
	const verificationCodePattern = /^\d{6}$/;
	if (verificationCode) {
		if (!verificationCodePattern.test(verificationCode)) {
			return error(400, 'ERR_CODE_INVALID');
		}
		console.log('[MIDDLEWARE] Verification Code Check Succeeded')
		ctx.verificationCode = verificationCode;
	}
}
