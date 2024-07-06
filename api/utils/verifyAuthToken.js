// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import extractBearerTokenFromHeaders from "./extractHeaders";
import { createRemoteJWKSet, jwtVerify } from 'jose';

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
