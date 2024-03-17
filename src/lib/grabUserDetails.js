/**
 * Fetches the details of a user by sending a GET request to the user's endpoint.
 * The function constructs a request to the API using the user's ID and an access token for authorization.
 * It then attempts to fetch the user details from the server. If the server responds with a successful
 * response, the function returns the response data as a formatted JSON string.
 *
 * In case of a failure due to a network error or if the server responds with a non-OK status,
 * the function throws an error object containing a message and a status code. Errors caught during
 * the fetch operation are logged to the console and re-thrown with additional detail if available,
 * or as received from the fetch operation.
 *
 * @param {Object} env An object containing environment-specific variables, including `LOGTO_DOMAIN` which represents the base URL for the API.
 * @param {string} accessToken The access token used for authorization in the API request.
 * @param {string} userid The ID of the user whose details are being fetched.
 * @returns {Promise<string>} A promise that resolves to a stringified JSON representation of the user details.
 * @throws {Object} Throws an object containing an error message and status code if the fetch operation fails or if the server responds with an error.
 */

export default async function grabUserDetails(env, accessToken, userid) {
	const url = `${env.LOGTO_DOMAIN}/api/users/${encodeURIComponent(userid)}`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
	};

	try {
		const response = await fetch(url, { method: 'GET', headers });
		if (!response.ok) {
			throw { message: 'Failed to access resource - ERR 2344', status: response.status };
		}
		const data = await response.json();
		return JSON.stringify(data, null, 2);
	} catch (error) {
		console.error('Error accessing resource:', error);
		throw typeof error === 'string' ? { message: error, status: 500 } : error;
	}
}
