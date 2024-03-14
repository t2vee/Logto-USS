export default async function sendSMSVerificationCode(env, accessToken, userNumber) {
	const url = `${env.LOGTO_DOMAIN}/api/verification-codes`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	};
	console.log(userNumber)
	const body = JSON.stringify({ phone: userNumber });
	console.log(body)
	const response = await fetch(url, { method: 'POST', headers, body });
	try {
		if (!response.ok) {
			throw { message: 'Failed to access resource due to network error - ERR 3621', status: response.status };
		}
		return response;
	} catch (error) {
		console.error('Error accessing resource:', error);
		throw typeof error === 'string' ? { message: error, status: 500 } : error;
	}
}
