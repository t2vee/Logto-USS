function str2ab(str) {
	const buf = new ArrayBuffer(str.length);
	const bufView = new Uint8Array(buf);
	for (let i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return buf;
}

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
