// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


export default async function (env, accessToken, userData, userId) {
	const url = `${env.LOGTO_DOMAIN}/api/users/${userId}/password/verify`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	};
	const body = JSON.stringify(userData);
	const response = await fetch(url, { method: 'POST', headers, body });
	if (!response.ok) {
		console.error('Error accessing resource:', response.statusText);
		throw { message: 'Failed to access resource - ERR 845679', status: response.status };
	}
	return response;
}
