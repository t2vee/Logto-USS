import sendEmailVerificationCode from "../../../lib/sendEmailVerificationCode";
import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureEMPTY from "../../../responses/raw/failure-EMPTY";

export default async (request, env) => {
	const requestData = await request.json();
	const email = requestData.email;
	try {
		const response = await sendEmailVerificationCode(env, request.accesstoken, email);
		return response.status === 204
			? successEMPTY(env)
			: failureEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 500)
	}
}
