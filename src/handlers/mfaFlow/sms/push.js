import grabUserDetails from "../../../lib/grabUserDetails";
import sendSMSVerificationCode from "../../../lib/sendSMSVerificationCode";
import prepareNumber from "../../../utils/prepareNumber";
import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";
import failedResponseWithMessage from "../../../responses/failedResponseWithMessage";

/**
 * Handles the process of sending an SMS verification code to the user's primary phone number.
 * This operation involves several steps:
 * 1. Verifying the user ID from the request using middleware.
 * 2. Fetching an access token using the environment-specific method.
 * 3. Retrieving the user's details with the fetched access token and the user ID from the request.
 * 4. Preparing the user's primary phone number for the SMS sending operation.
 * 5. Attempting to send an SMS verification code to the prepared phone number.
 * If the SMS is successfully sent (indicated by a 204 status in the response),
 * an empty success response is returned. Otherwise, a generic failure response is returned.
 * In the event of an exception during the process, a failure response with a specific error message is returned.
 *
 * @param {Request} request The incoming request object, which is expected to include the user ID in its parameters.
 * @param {EnvironmentVariables} env An object containing environment-specific variables and secrets necessary for operation.
 * @returns {Promise<Response>} A promise that resolves to a response object. Depending on the outcome, the response can be
 * either an empty success response, a generic failure response, or a failure response with a specific error message.
 * @throws {Error} This function can throw errors if the underlying operations fail. Such errors are caught and handled by returning
 * a failure response with the error message.
 */

export default async (request, env) => {
	try {
		const userData = await grabUserDetails(env, request.accesstoken, request.userid)
		const usrDObj = JSON.parse(userData)
		const response = await sendSMSVerificationCode(env, request.accesstoken, await prepareNumber(usrDObj.primaryPhone));
		return response.status === 204
			? emptySuccessResponse(env)
			: failedResponse;
	} catch (error) {
		return failedResponseWithMessage(error);
	}
}
