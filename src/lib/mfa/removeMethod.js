// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license. 


export default async function (env, accessToken, userId, id) {
	const url = `${env.LOGTO_DOMAIN}/api/users/${userId}/mfa-verifications/`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	};
	const appResponse = await fetch(url + id.appid, { method: 'DELETE', headers });
	if (!appResponse.ok) {
		console.error('Error accessing resource:', appResponse);
		throw { message: 'Failed to access resource - ERR 2834567', status: appResponse.status };
	}
	const response = await fetch(url + id.backupid, { method: 'DELETE', headers });
	if (!response.ok) {
		console.error('Error accessing resource:', response);
		throw { message: 'Failed to access resource - ERR 9023457', status: response.status };
	}
	return true;
}
