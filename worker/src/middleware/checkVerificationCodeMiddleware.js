// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import failureCONTENT from "../responses/raw/content400";

export default async (request, env, ctx) => {
	const url = new URL(request.url);
	const verificationCode = url.searchParams.get('verification-code');
	const verificationCodePattern = /^\d{6}$/;
	if (verificationCode) {
		if (!verificationCodePattern.test(verificationCode)) {
			return failureCONTENT(env,'ERR_CODE_INVALID', 400);
		}
		console.log('[MIDDLEWARE] Verification Code Check Succeeded')
		ctx.verificationCode = verificationCode;
	}
}
