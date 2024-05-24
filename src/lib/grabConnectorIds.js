// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license. 


export default async (env, accessToken) => {
	const url = `${env.LOGTO_DOMAIN}/api/connectors`;
	const headers = {'Authorization': `Bearer ${accessToken}`,};
	try {
		const response = await fetch(url, { method: 'GET', headers });
		return await response.json();
	} catch (error) {
		console.error('Error accessing resource:', error);
		throw new error(404, 'There was a error processing resource - Trace ID: 289034');
	}
}
