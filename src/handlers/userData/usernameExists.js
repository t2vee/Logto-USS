import checkUsernameAvailability from "../../lib/checkUsernameAvailability";
import emptySuccessResponse from "../../responses/emptySuccessResponse";
import successResponse from "../../responses/successResponse";
import failedResponseWithMessage from "../../responses/failedResponseWithMessage";

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
		return failedResponseWithMessage('No Username Provided');
	}
	try {
		const resourceResponse = await checkUsernameAvailability(env, request.accesstoken, request.params.username);
		if (resourceResponse === '[]') {
			return emptySuccessResponse(env);
		} else {
			return successResponse(env, 'Username Taken');
		}
	} catch (error) {
		return failedResponseWithMessage(error);
	}
}
