import fetchAccessToken from "../../../utils/fetchAccessToken";
import grabUserDetails from "../../../lib/grabUserDetails";
import verifyEmailCode from "../../../lib/verifyEmailCode";
import checkMfaVerificationCode from "../../../middleware/checkVerificationCodeMiddleware";
import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import checkUserIdMiddleware from "../../../middleware/checkUserIdMiddleware";
/**
 * Handles the POST request to verify an email code as part of the multi-factor authentication flow.
 * This route validates the `userid` and `verificationCode` parameters, ensuring the `userid` is a 12-character
 * alphanumeric string without symbols, and the `verificationCode` is a 6-digit code.
 *
 * @param {Request} request The incoming request object. It contains the `userid` as part of the URL path
 *                          and expects a `verification-code` as a URL search parameter.
 * @param {Object} env An object containing environment variables and other server-side configurations.
 *
 * @returns {Response} Returns a `Response` object. If the validation fails, it returns a 400 status code with
 *                     an error message. On successful validation but failed authentication or other errors,
 *                     it returns a 500 status code with an error message. If the verification is successful,
 *                     it returns a 204 status code and optionally updates the MFARequiredTokens state.
 *
 * @route `POST /api/v1/mfa-flow/:userid/verify-email-code`
 *
 * @example
 * // URL format: /api/v1/mfa-flow/a3sv2i21ubfy/verify-email-code?verification-code=123456
 *
 * @validation
 * - `userid` must be a 12-character alphanumeric string, validated against /^[a-zA-Z0-9]{12}$/ regex.
 * - `verificationCode` must be a 6-digit number, validated against /^\d{6}$/ regex.
 *
 * @error Handling
 * - Returns a 400 status code if `userid` or `verification-code` are missing or invalid.
 * - Returns a 500 status code with an error message if there's an error during the verification process or
 *   if the server encounters an unexpected error.
 */
export default async (request, env) => {
	await checkUserIdMiddleware(request)
	const verificationCode = await checkMfaVerificationCode(request)

	try {
		const accessToken = await fetchAccessToken(env);
		const userData = await grabUserDetails(env, accessToken, request.params.userid);
		const usrDObj = JSON.parse(userData);
		const response = await verifyEmailCode(env, accessToken, usrDObj.primaryEmail, verificationCode);
		return response.status === 204
			? env.MFARequiredTokens.put(request.params.userid, false, {expirationTtl: 9000}) && emptySuccessResponse(env)
			: new Response(JSON.stringify({ status: 'failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
	} catch (error) {
		return new Response(JSON.stringify({ message: error.message }), { status: error.status || 500, headers: { 'Content-Type': 'application/json' } });
	}
}
