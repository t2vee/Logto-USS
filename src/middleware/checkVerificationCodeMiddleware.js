import failedResponseWithMessage from "../responses/failedResponseWithMessage";

export default async (request) => {
	const url = new URL(request.url);
	const verificationCode = url.searchParams.get('verification-code');
	const verificationCodePattern = /^\d{6}$/;
	if (!verificationCode || !verificationCodePattern.test(verificationCode)) {
		return failedResponseWithMessage('Invalid verification code provided');
	}
	console.log('[MIDDLEWARE] Verification Code Check Succeeded')
	return verificationCode;
}
