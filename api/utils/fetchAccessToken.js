// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


export default async function fetchAccessToken(env) {
	const url = `${env.LOGTO_DOMAIN}/oidc/token`;
	const credentials = btoa(`${env.LOGTO_APP_ID}:${env.LOGTO_APP_SECRET}`);
	const headers = {
		'Authorization': `Basic ${credentials}`,
		'Content-Type': 'application/x-www-form-urlencoded'
	};
	const body = `grant_type=client_credentials&resource=${env.LOGTO_DEFAULT_RESOURCE}&scope=all`;
	try {
		const response = await fetch(url, { method: 'POST', headers, body });
		if (!response.ok) {
			throw { message: 'Failed to fetch access token', status: response.status };
		}
		const data = await response.json();
		if (!data.access_token) {
			throw { message: 'Access token is missing in response', status: 500 };
		}
		return data;
	} catch (error) {
		console.error('Error fetching access token:', error);
		throw typeof error === 'string' ? { message: error, status: 500 } : error;
	}
}
