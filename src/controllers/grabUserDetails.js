export default async function grabUserDetails(env, accessToken, userid) {
	const url = `${env.LOGTO_DOMAIN}/api/users/${encodeURIComponent(userid)}`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
	};

	try {
		const response = await fetch(url, { method: 'GET', headers });
		if (!response.ok) {
			throw { message: 'Failed to access resource due to network error - ERR 2344', status: response.status };
		}
		const data = await response.json();
		return JSON.stringify(data, null, 2);
	} catch (error) {
		console.error('Error accessing resource:', error);
		throw typeof error === 'string' ? { message: error, status: 500 } : error;
	}
}
