// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license. 


import grabUserDetails from "../../../lib/grabUserDetails";
import sendEmailVerificationCode from "../../../lib/sendEmailVerificationCode";
import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureEMPTY from "../../../responses/raw/failure-EMPTY";

/**
 * Processes a request to send an email verification code to a user's primary email address.
 * This function first validates the user ID from the request using a middleware.
 * Then, it fetches an access token and retrieves the user's details.
 * Finally, it attempts to send an email verification code to the user's primary email.
 * If the email is successfully sent, it returns an empty success response;
 * otherwise, it returns a failure response.
 *
 * @param {Request} request The incoming request object, expected to contain the user ID in its parameters.
 * @param {EnvironmentVariables} env An object containing environment variables and secrets.
 * @returns {Promise<Response>} A promise that resolves to a response object. The response can be an empty success response, a generic failure response, or a failure response with a specific error message, depending on the outcome of the operation.
 * @throws {Error} Throws an error if any step in the process fails, which is caught and handled by returning a failure response with the error message.
 */

export default async (request, env) => {
	try {
		const userData = await grabUserDetails(env, request.accesstoken, request.userid)
		const usrDObj = JSON.parse(userData)
		const response = await sendEmailVerificationCode(env, request.accesstoken, usrDObj.primaryEmail);
		return response.status === 204
			? successEMPTY(env)
			: failureEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 418)
	}
}
