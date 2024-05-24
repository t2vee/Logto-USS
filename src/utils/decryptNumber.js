// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import importRsaPrivateKey from './importRSAKey';
/**
 * Decrypts a given piece of encrypted data using RSA-OAEP.
 *
 * This function first imports an RSA private key from a specified environment.
 * It then converts the base64-encoded encrypted data into a Uint8Array,
 * decrypts the data using the RSA-OAEP algorithm with the imported private key,
 * and finally decodes the decrypted data into a string.
 *
 * @param {Object} env An object containing environment-specific variables and configurations.
 * @param {string} encryptedData The base64-encoded encrypted data to be decrypted.
 * @returns {Promise<string>} A promise that resolves to the decrypted data as a string.
 * @throws Will throw an error if decryption fails or the environment setup is incorrect.
 */

export default async function decryptNumber(env, encryptedData) {
	const privateKey = await importRsaPrivateKey(env)
	const encryptedBuffer = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
	const decryptedData = await crypto.subtle.decrypt(
		{
			name: "RSA-OAEP",
		},
		privateKey,
		encryptedBuffer
	);
	const decoder = new TextDecoder();
	return decoder.decode(decryptedData);
}
