// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


/**
 * Converts a string to an ArrayBuffer.
 *
 * @param {string} str The string to be converted.
 * @returns {ArrayBuffer} The ArrayBuffer representation of the input string.
 */
function str2ab(str) {
	const buf = new ArrayBuffer(str.length);
	const bufView = new Uint8Array(buf);
	for (let i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return buf;
}
/**
 * Imports an RSA private key for use with the Web Crypto API.
 *
 * This function extracts the PEM contents from an environment variable, removes PEM headers and footers,
 * and converts the base64-encoded private key into an ArrayBuffer using the str2ab function.
 * It then uses the Web Crypto API to import the key for RSA-OAEP decryption.
 *
 * @param {Object} env An object containing environment-specific variables, including `NUMBER_DECRYPT_KEY` which holds the RSA private key in PEM format.
 * @returns {Promise<CryptoKey>} A promise that resolves to the imported RSA private key as a CryptoKey object.
 * @throws Will throw an error if the key import fails.
 */
export default async function importRsaPrivateKey(env) {
	const pem = atob(env.NUMBER_DECRYPT_KEY)
	const pemHeader = "-----BEGIN PRIVATE KEY-----";
	const pemFooter = "-----END PRIVATE KEY-----";
	const pemContents = pem.substring(
		pemHeader.length,
		pem.length - pemFooter.length - 1,
	);
	const binaryDerString = atob(pemContents.replace('-', ''));
	const binaryDer = str2ab(binaryDerString);
	return crypto.subtle.importKey(
		"pkcs8",
		binaryDer,
		{
			name: "RSA-OAEP",
			hash: "SHA-256",
		},
		false,
		["decrypt"],
	);
}
