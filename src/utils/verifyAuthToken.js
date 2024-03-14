import extractBearerTokenFromHeaders from "./extractHeaders";
import { createRemoteJWKSet, jwtVerify } from 'jose';


/**
 * Verifies the authorization token using the JWT verify method from the 'jose' library.
 *
 * @param {Request} request - The Fetch API request object.
 * @param env
 * @returns {Promise<Object>} A promise that resolves with the JWT payload if the token is successfully verified.
 * @throws {{ message: string, status: number }} Throws an error object with a message and status code if token verification fails or if the token is invalid.
 */
export default async function verifyAuthToken(request, env) {
	try {
		const token = extractBearerTokenFromHeaders(request.headers);
		const JWKS = createRemoteJWKSet(new URL(env.JWKS_URI));
		const { payload } = await jwtVerify(token, JWKS, {
			issuer: env.ISSUER,
			audience: 'https://default.logto.app/api', // Update this with your actual value
		});
		// Optionally, perform additional validations, e.g., RBAC with scope
		// if (!payload.scope.includes('some_scope')) {
		//     throw new Error('Insufficient scope');
		// }
		return payload;
	} catch (error) {
		throw typeof error === 'string' ? { message: error, status: 401 } : error;
	}
}
