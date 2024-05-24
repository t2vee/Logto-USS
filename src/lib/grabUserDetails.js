// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { LogtoException, _500, _403 } from '../exceptions/logtoResponse';

export default async function grabUserDetails(env, accessToken, userid) {
	try {
		const url = `${env.LOGTO_DOMAIN}/api/users/${encodeURIComponent(userid)}`;
		const headers = {'Authorization': `Bearer ${accessToken}`};
		const response = await fetch(url, { method: 'GET', headers });
		const data = await response.json();
		return JSON.stringify(data, null, 2);
	} catch (error) {
		console.error('grabUserDetails.js - Trace ID: 2344:', error);
		switch (error.response.status) {
			case 404:
			case 400:
				throw new LogtoException('ERR_USR_ID_INVALID');
			case 403:
			case 401:
				throw new LogtoException(_403, 500);
			case 500:
				throw new LogtoException(_500, 500);
		}
	}
}
