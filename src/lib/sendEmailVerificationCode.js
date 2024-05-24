// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { LogtoException, _500, _403 } from '../exceptions/logtoResponse';

export default function sendEmailVerificationCode(env, accessToken, userEmail) {
	const url = `${env.LOGTO_DOMAIN}/api/verification-codes`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	};
	const body = JSON.stringify({ email: userEmail });
	return fetch(url, { method: 'POST', headers, body })
		.then(r => {
			if (!r.ok) {
				switch (r.status) {
					case 400:
						throw new LogtoException('ERR_PAYLOAD_INVALID', 400);
					case 403:
					case 401:
						throw new LogtoException(_403, 500);
					case 500:
						throw new LogtoException(_500, 500);
				}
			}
			return r.status;
		})
		.catch(e => {
			console.error('sendEmailVerificationCode.js - Trace ID: 4783:', e);
			throw e;
		})
}
