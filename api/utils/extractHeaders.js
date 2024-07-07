// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license. 


/**
 * Extracts the Bearer token from the request headers.
 *
 * @param {Headers} headers - The Headers object from the Fetch API request.
 * @returns {string} The extracted Bearer token.
 * @throws {{ message: string, status: number }} Throws an error object with a message and status code if the Authorization header is missing or if the token type is not supported.
 */
export default function extractBearerTokenFromHeaders(headers) {
	const authorization = headers.get('Authorization');
	if (!authorization) {
		throw { message: 'Authorization header missing - ERR 3467', status: 401 };
	}
	if (!authorization.startsWith('Bearer ')) {
		throw { message: 'Authorization token type not supported', status: 401 };
	}
	return authorization.slice('Bearer '.length);
}
