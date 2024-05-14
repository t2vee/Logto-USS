import verifyEmailCode from "../../../lib/verifyEmailCode";
import updateUserData from "../../../lib/updateUserData";
import checkVerificationCodeMiddleware from "../../../middleware/checkVerificationCodeMiddleware";
import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureEMPTY from "../../../responses/raw/failure-EMPTY";

export default async (request, env) => {
	const verificationCode = await checkVerificationCodeMiddleware(request, env)
	const requestData = await request.json();
	const email = requestData.email;
	try {
		const response = await verifyEmailCode(env, request.accesstoken, email, verificationCode);
		if (response.status === 204) {
			const userData = {
				"primaryEmail": email
			}
			const updateResponse = await updateUserData(env, request.accesstoken, userData, request.userid)
			return response.status === 204 && updateResponse.status === 200
				? successEMPTY(env)
				: failureEMPTY(env);
		} else {
			return failureEMPTY(env);
		}
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 500)
	}
}
