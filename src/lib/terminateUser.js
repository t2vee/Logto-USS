export default async function (env, accessToken, userId) {
	const url = `${env.LOGTO_DOMAIN}/api/users/${userId}`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	};
	const response = await fetch(url, { method: 'DELETE', headers });
	if (!response.ok) {
		console.error('Error accessing resource:', response);
		throw { message: 'Failed to access resource - ERR 345675', status: response.status };
	}
	return response;
}
