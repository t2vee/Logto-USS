/**
 * Checks the availability of a username by querying a specific endpoint with the user's ID.
 * This function sends a GET request to the endpoint responsible for MFA verifications,
 * appending the user's ID as part of the URL. It uses an access token for authorization.
 *
 * If the request is successful, it returns the response data as a formatted JSON string.
 * If the request fails due to a network error or the server responds with a non-OK status,
 * it throws an error with a message and status code. Errors caught during the fetch operation
 * are re-thrown with additional detail, if available, or as received from the fetch operation.
 *
 * @param {Object} env An object containing environment-specific variables. Must include `LOGTO_DOMAIN` representing the base URL for the API.
 * @param {string} accessToken The access token used for authorization in the API request.
 * @param {string} userid The user ID whose availability is being checked.
 * @returns {Promise<string>} A promise that resolves to a stringified JSON representation of the API response data.
 * @throws {Object} Throws an object containing an error message and status code if the fetch operation fails or if the server responds with an error.
 */

export default async function checkUsernameAvailability(env, accessToken, userid) {
	const url = `${env.LOGTO_DOMAIN}/api/users/${encodeURIComponent(userid)}/mfa-verifications`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
	};

	try {
		const response = await fetch(url, { method: 'GET', headers });
		if (!response.ok) {
			throw { message: 'Failed to access resource due to network error - ERR 7893', status: response.status };
		}
		return await response.json();
	} catch (error) {
		console.error('Error accessing resource:', error);
		throw typeof error === 'string' ? { message: error, status: 500 } : error;
	}
}
