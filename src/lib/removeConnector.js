export default async function (env, accessToken, userId, target) {
	const url = `${env.LOGTO_DOMAIN}/api/users/${userId}/identities/${target}`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	};
	const response = await fetch(url, { method: 'DELETE', headers });
	if (!response.ok) {
		console.error('Error accessing resource:', response);
		throw { message: 'Failed to access resource - ERR 097853', status: response.status };
	}
	return response;
}
