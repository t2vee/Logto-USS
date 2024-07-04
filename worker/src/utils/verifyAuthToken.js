// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


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
		const JWKS = createRemoteJWKSet(new URL(`${env.LOGTO_DOMAIN}/oidc/jwks`));
		const { payload } = await jwtVerify(token, JWKS, {
			issuer: `${env.LOGTO_DOMAIN}/oidc`,
			audience: env.LOGTO_DEFAULT_RESOURCE,
		});
		return payload;
	} catch (error) {
		throw typeof error === 'string' ? { message: error, status: 401 } : error;
	}
}
