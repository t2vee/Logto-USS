// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license. 


/**
 * Verifies an email verification code by sending it along with the user's email to a specified API endpoint.
 * This function constructs a POST request with authorization and content type headers. The email address and
 * verification code are included in the body of the request. It aims to verify the code provided by the user
 * during processes such as account registration or email address verification.
 *
 * If the API endpoint successfully processes the request and verifies the code, the response object is returned.
 * In case of a failure, such as a network error or if the server responds with a non-OK status, an error object
 * containing a detailed message and the status code is thrown.
 *
 * @param {Object} env An object containing environment-specific variables, notably `LOGTO_DOMAIN` for the API's base URL.
 * @param {string} accessToken The access token used for authorization in the API request.
 * @param {string} userEmail The email address associated with the verification code to be verified.
 * @param {string} verificationCode The verification code to be verified.
 * @returns {Promise<Response>} A promise that resolves to the server's response object upon successful verification.
 * @throws {Object} An error object with a message and status code if the verification process fails.
 */

export default async function verifyEmailCode(env, accessToken, userEmail, verificationCode) {
	const url = `${env.LOGTO_DOMAIN}/api/verification-codes/verify`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	};
	const body = JSON.stringify({ email: userEmail, "verificationCode": verificationCode });
	try {
		const response = await fetch(url, { method: 'POST', headers, body });
		if (!response.ok) {
			throw { message: 'Failed to access resource due to network error - ERR 4892', status: response.status };
		}
		return response;
	} catch (error) {
		console.error('Error accessing resource:', error);
		throw typeof error === 'string' ? { message: error, status: 500 } : error;
	}
}
