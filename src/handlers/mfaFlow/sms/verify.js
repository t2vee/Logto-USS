import fetchAccessToken from "../../../utils/fetchAccessToken";
import grabUserDetails from "../../../lib/grabUserDetails";
import verifySMSCode from "../../../lib/verifySMSCode";
import prepareNumber from "../../../utils/prepareNumber";
import checkVerificationCodeMiddleware from "../../../middleware/checkVerificationCodeMiddleware";
import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";
import failedResponseWithMessage from "../../../responses/failedResponseWithMessage";

/**
 * Verifies an SMS verification code sent to a user's primary phone number. The function follows a sequence of operations:
 * 1. Validates the presence of a user ID in the request using middleware.
 * 2. Validates the verification code provided in the request using another middleware.
 * 3. Fetches an access token for use in subsequent API calls.
 * 4. Retrieves the user's details, including the primary phone number, using the access token and user ID.
 * 5. Prepares the user's phone number in a standardized format for verification.
 * 6. Attempts to verify the provided SMS code against the user's phone number.
 * If the verification succeeds (response status 204), it updates the user's MFA token status to false, indicating no further MFA is required for a session, and returns an empty success response.
 * If the verification fails or any step throws an error, it returns a failure response, either generic or with a specific error message.
 *
 * @param {Request} request The incoming request object. It should include the user ID in its parameters and the verification code.
 * @param {EnvironmentVariables} env An object containing environment variables and secrets. This includes access to external services for fetching access tokens, user details, and verifying SMS codes.
 * @returns {Promise<Response>} A promise that resolves to an empty success response upon successful verification or a failure response (generic or with an error message) if verification fails or an error occurs.
 * @throws {Error} Captures and handles any errors that occur during the verification process, returning a failure response with the error message.
 */
export default async (request, env) => {
	const verificationCode = await checkVerificationCodeMiddleware(request)
	try {
		const accessToken = await fetchAccessToken(env);
		const userData = await grabUserDetails(env, accessToken, request.userid);
		const usrDObj = JSON.parse(userData);
		const response = await verifySMSCode(env, accessToken, await prepareNumber(usrDObj.primaryPhone), verificationCode);
		return response.status === 204
			? env.MFARequiredTokens.put(request.userid, false, {expirationTtl: 9000})  && emptySuccessResponse(env)
			: failedResponse();
	} catch (error) {
		return failedResponseWithMessage(error);
	}
}
