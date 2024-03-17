/**
 * Fetches a resource using the provided access token and checks for a specific username.
 *
 * @param env
 * @param {string} accessToken - The access token to authenticate the request.
 * @param {string} username - The username to search for in the resource.
 * @returns {Promise<string>} A promise that resolves with the resource data as a stringified JSON object.
 * @throws {{ message: string, status: number }} Throws an error object with a message and status code if accessing the resource fails.
 */
export default async function checkUsernameAvailability(env, accessToken, username) {
	const url = `${env.LOGTO_DOMAIN}/api/users?search=${encodeURIComponent(username)}`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
	};

	try {
		const response = await fetch(url, { method: 'GET', headers });
		if (!response.ok) {
			throw { message: 'Failed to access resource due to network error', status: response.status };
		}
		const data = await response.json();
		return JSON.stringify(data, null, 2);
	} catch (error) {
		console.error('Error accessing resource:', error);
		throw typeof error === 'string' ? { message: error, status: 500 } : error;
	}
}
