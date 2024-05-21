export default async function (env, accessToken, userData, userId) {
	const url = `${env.LOGTO_DOMAIN}/api/users/${userId}/identities`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	};
	console.log(JSON.stringify(userData))
	const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(userData) });
	if (!response.ok) {
		console.error('Error accessing resource:', response.statusText);
		throw { message: 'Failed to access resource - Trace ID: 584679', status: response.status };
	}
	return response;
}
