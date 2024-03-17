/**
 * Updates user data for a specified user by sending a PATCH request to the user's endpoint.
 * This function constructs the request with the necessary headers for authorization and content type,
 * along with the user data to be updated in the request body. It targets the specific user by appending
 * the user's ID to the endpoint URL.
 *
 * If the request is successfully executed and the server responds with an OK status, the response object is returned.
 * In case of a failure, such as a non-OK response from the server or a network error, an error object containing
 * a message and the response's status code is thrown.
 *
 * @param {Object} env An object containing environment-specific variables, including `LOGTO_DOMAIN` for the API base URL.
 * @param {string} accessToken The access token used for authorization in the API request.
 * @param {Object} userData The user data to be updated, represented as a key-value pair object.
 * @param {string} userId The ID of the user whose data is being updated.
 * @returns {Promise<Response>} A promise that resolves to the server's response object.
 * @throws {Object} An error object with a message and status code if the operation fails.
 */

export default async function updateUserData(env, accessToken, userData, userId) {
	const url = `${env.LOGTO_DOMAIN}/api/users/${userId}`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	};
	const body = JSON.stringify(userData);
	try {
		const response = await fetch(url, { method: 'PATCH', headers, body });
		if (!response.ok) {
			throw { message: 'Failed to access resource - ERR 29034', status: response.status };
		}
		return response;
	} catch (error) {
		console.error('Error accessing resource:', error);
		throw typeof error === 'string' ? { message: error, status: 500 } : error;
	}
}
