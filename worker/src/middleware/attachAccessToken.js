// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import fetchAccessToken from "../utils/fetchAccessToken";
/**
 * Tries to fetch the access token from KV storage, or fetches a new one if the stored token is expired or not present.
 *
 * @param req
 * @param {any} env - Environment bindings from Workers, including KV bindings and environment variables.
 * @returns {Promise<string>} A promise that resolves with the access token.
 * @throws {{ message: string, status: number }} Throws an error object if fetching the access token fails.
 */
export default async (req, env) => {
	let accessToken = await env.LogtoAccessToken.get("access_token");
	let expiry = await env.LogtoAccessToken.get("token_expiry");
	const now = Math.floor(Date.now() / 1000);
	if (!accessToken || !expiry || parseInt(expiry) <= now) {
		console.log("[MIDDLEWARE] Access token expired. Fetching New Token...");
		try {
			const accessTokenResponse = await fetchAccessToken(env);
			await env.LogtoAccessToken.put("access_token", accessTokenResponse.access_token, { expirationTtl: accessTokenResponse.expires_in });
			await env.LogtoAccessToken.put("token_expiry", (now + accessTokenResponse.expires_in).toString(), { expirationTtl: accessTokenResponse.expires_in });
			req.accesstoken = accessTokenResponse.access_token;
		} catch (err) {
			console.log('Failed to fetch AccessToken', err);
			req.accesstoken = null;
		}
	} else {
		req.accesstoken = accessToken;
	}
	console.log('[MIDDLEWARE] Request Tokens Setup Complete')
}
