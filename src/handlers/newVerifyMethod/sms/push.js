//import decryptNumber from "../../../utils/decryptNumber"; 🤡🤡
import prepareNumber from "../../../utils/prepareNumber";
import sendSMSVerificationCode from "../../../lib/sendSMSVerificationCode";
import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureEMPTY from "../../../responses/raw/failure-EMPTY";

export default async (request, env) => {
	const requestData = await request.json();
	const encryptedPhoneNumber = requestData.encryptedPhoneNumber; // not encrypted just shitty planning
	try {
		//const userNumber = await decryptNumber(env, encryptedPhoneNumber);
		const num = await prepareNumber(encryptedPhoneNumber)
		const response = await sendSMSVerificationCode(env, request.accesstoken, num);
		return response.status === 204
			? successEMPTY(env)
			: failureEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 500)
	}
}
