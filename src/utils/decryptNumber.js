import importRsaPrivateKey from './importRSAKey';

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
