// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license. 


/**
 * Verifies an SMS verification code by sending it along with the user's phone number to a specified API endpoint.
 * Constructs a POST request with authorization and content type headers, including the user's phone number and
 * the verification code in the request body. It's used primarily for processes such as phone number verification
 * or two-factor authentication (2FA).
 *
 * The function handles the API response, returning the response object for successful verifications. If the server
 * response indicates a failure (non-OK status) or a network error occurs, it throws an error object containing
 * a detailed message and the status code for further handling.
 *
 * @param {Object} env An object containing environment-specific variables, including `LOGTO_DOMAIN` which represents the API base URL.
 * @param {string} accessToken The access token used for authorization in the API request.
 * @param {string} userNumber The phone number associated with the verification code to be verified.
 * @param {string} verificationCode The SMS verification code to be verified.
 * @returns {Promise<Response>} A promise that resolves to the server's response object upon successful verification.
 * @throws {Object} An error object with a message and status code if the verification process encounters an error.
 */

export default async function verifySMSCode(env, accessToken, userNumber, verificationCode) {
	const url = `${env.LOGTO_DOMAIN}/api/verification-codes/verify`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	};
	const body = JSON.stringify({ phone: userNumber, "verificationCode": verificationCode });
	try {
		const response = await fetch(url, { method: 'POST', headers, body });
		if (!response.ok) {
			throw { message: 'Failed to access resource - ERR 5984', status: response };
		}
		return response;
	} catch (error) {
		console.error('Error accessing resource:', error);
		throw typeof error === 'string' ? { message: error, status: 500 } : error;
	}
}
