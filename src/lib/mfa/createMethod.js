export default async function (env, accessToken, userId) {
	const url = `${env.LOGTO_DOMAIN}/api/users/${userId}/mfa-verifications`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	};
	let body = JSON.stringify({"type": "Totp"});
	const appResponse = await fetch(url, { method: 'POST', headers, body });
	if (!appResponse.ok) {
		console.error('Error accessing resource:', appResponse);
		throw { message: 'Failed to access resource - ERR 45742367', status: appResponse.status };
	}
	body = JSON.stringify({"type": "BackupCode"});
	const response = await fetch(url, { method: 'POST', headers, body });
	if (!response.ok) {
		console.error('Error accessing resource:', response);
		throw { message: 'Failed to access resource - ERR 8765754', status: response.status };
	}
	return {
		"AppAuthenticator": await appResponse.json(),
		"BackupCodes": await response.json(),
	};
}
