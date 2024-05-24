// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


/**
 * Sends an SMS verification code to a given user number by making a POST request to a specified API endpoint.
 * This function constructs the request with necessary headers, including the authorization token and content type.
 * It then sends the user's phone number in the request body to the endpoint responsible for generating and sending verification codes.
 *
 * If the request is successfully executed and the server responds with an OK status, the response object is returned.
 * In case of a failure, such as a network error or a non-OK response from the server, an error object is thrown.
 * This error object includes a message detailing the failure and the HTTP status code of the response.
 *
 * Note: Console logs are present for debugging purposes, displaying the user number and the request body.
 *
 * @param {Object} env An object containing environment-specific variables, notably `LOGTO_DOMAIN` for the API's base URL.
 * @param {string} accessToken The access token used for authorization in the API request.
 * @param {string} userNumber The phone number of the user to whom the SMS verification code is being sent.
 * @returns {Promise<Response>} A promise that resolves to the server's response object.
 * @throws {Object} An error object with a message and a status code if the operation fails.
 */

export default async function sendSMSVerificationCode(env, accessToken, userNumber) {
	const url = `${env.LOGTO_DOMAIN}/api/verification-codes`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	};
	const body = JSON.stringify({ phone: userNumber });
	const response = await fetch(url, { method: 'POST', headers, body });
	try {
		if (!response.ok) {
			throw { message: 'Failed to access resource due to network error - ERR 3621', status: response.status };
		}
		return response;
	} catch (error) {
		console.error('Error accessing resource:', error);
		throw typeof error === 'string' ? { message: error, status: 500 } : error;
	}
}
