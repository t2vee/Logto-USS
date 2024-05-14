import failureCONTENT from "../responses/raw/failure-CONTENT";

export default async (request, env) => {
	const url = new URL(request.url);
	const verificationCode = url.searchParams.get('verification-code');
	const verificationCodePattern = /^\d{6}$/;
	if (!verificationCode || !verificationCodePattern.test(verificationCode)) {
		return failureCONTENT(env,'Invalid verification code provided', 400);
	}
	console.log('[MIDDLEWARE] Verification Code Check Succeeded')
	return verificationCode;
}
