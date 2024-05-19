export default async function (env, accessToken, userId, type) {
	const url = `${env.LOGTO_DOMAIN}/api/users/${userId}/mfa-verifications`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	};
	const body = JSON.stringify({"type": type})
	const response = await fetch(url, { method: 'POST', headers, body });
	if (!response.ok) {
		console.error('Error accessing resource:', response);
		throw { message: 'Failed to access resource - ERR 84754', status: response.status };
	}
	return response;
}
