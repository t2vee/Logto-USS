import checkUsernameAvailability from "../../lib/checkUsernameAvailability";
import successCONTENT from "../../responses/raw/success-CONTENT";
import successEMPTY from "../../responses/raw/success-EMPTY";
import failureCONTENT from "../../responses/raw/failure-CONTENT";
import failureEMPTY from "../../responses/raw/failure-EMPTY";

/**
 * Route handler for checking if a username exists.
 * Verifies the auth token and checks the specified username against the resource server.
 *
 * @param {Request} request - The Fetch API request object, expected to contain the username parameter in the URL path.
 * @param env
 * @param {Object} context - An object containing route parameters, among which is the username to check.
 * @returns {Response} A Fetch API response object with the result of the check or an error message.
 */
export default async (request, env, context) => {
	if (!request.params || !request.params.username) {
		return failureCONTENT(env, 'No Username Provided', 400);
	}
	try {
		const resourceResponse = await checkUsernameAvailability(env, request.accesstoken, request.params.username);
		if (resourceResponse === '[]') {
			return successEMPTY(env);
		} else {
			return successCONTENT(env, 'Username Taken');
		}
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 418)
	}
}
