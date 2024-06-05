// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import fetchAccessToken from "../utils/fetchAccessToken";

// caching access tokens to reduce requests to logto
export default async (req, env, ctx) => {
	let accessToken = await env.LogtoAccessToken.get("access_token");
	let expiry = await env.LogtoAccessToken.get("token_expiry");
	const now = Math.floor(Date.now() / 1000);
	if (!accessToken || !expiry || parseInt(expiry) <= now) {
		console.log("[MIDDLEWARE] Access token expired. Fetching New Token...");
		try {
			const accessTokenResponse = await fetchAccessToken(env);
			await env.LogtoAccessToken.put("access_token", accessTokenResponse.access_token, { expirationTtl: accessTokenResponse.expires_in });
			await env.LogtoAccessToken.put("token_expiry", (now + accessTokenResponse.expires_in).toString(), { expirationTtl: accessTokenResponse.expires_in });
			ctx.accesstoken = accessTokenResponse.access_token;
		} catch (err) {
			console.log('Failed to fetch AccessToken', err);
			ctx.accesstoken = null;
		}
	} else {
		ctx.accesstoken = accessToken;
	}
	console.log('[MIDDLEWARE] Request Tokens Setup Complete')
}
