/**
 * Sends an email verification code to the given email address by making a POST request
 * to the verification codes endpoint. The request includes the user's email in the body
 * and uses an access token for authorization in the headers.
 *
 * If the request to the server fails due to a network error or if the server responds with
 * a non-OK status, the function throws an error object containing a message and a status code.
 * Errors caught during the fetch operation are logged to the console and re-thrown with
 * additional detail if available, or as received from the fetch operation.
 *
 * @param {Object} env An object containing environment-specific variables, including `LOGTO_DOMAIN` which is the base URL for the API.
 * @param {string} accessToken The access token used for authorization in the API request.
 * @param {string} userEmail The email address to which the verification code will be sent.
 * @returns {Promise<Response>} A promise that resolves to the fetch response object from the server.
 * @throws {Object} Throws an object containing an error message and status code if the request fails or if the server responds with an error.
 */

export default async function sendEmailVerificationCode(env, accessToken, userEmail) {
	const url = `${env.LOGTO_DOMAIN}/api/verification-codes`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	};
	const body = JSON.stringify({ email: userEmail });
	try {
		const response = await fetch(url, { method: 'POST', headers, body });
		if (!response.ok) {
			throw { message: 'Failed to access resource - ERR 4783', status: response.status };
		}
		return response;
	} catch (error) {
		console.error('Error accessing resource:', error);
		throw typeof error === 'string' ? { message: error, status: 500 } : error;
	}
}
