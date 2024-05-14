import updateUserData from "../../../lib/updateUserData";
//import decryptNumber from "../../../utils/decryptNumber"; bruh
import verifySMSCode from "../../../lib/verifySMSCode";
import prepareNumber from "../../../utils/prepareNumber";
import checkVerificationCodeMiddleware from "../../../middleware/checkVerificationCodeMiddleware";
import failureEMPTY from "../../../responses/raw/failure-EMPTY";
import successEMPTY from "../../../responses/raw/success-EMPTY";

export default async (request, env) => {
	const verificationCode = await checkVerificationCodeMiddleware(request, env)
	const requestData = await request.json();
	const encryptedPhoneNumber = requestData.encryptedPhoneNumber;
	//const userNumber = await decryptNumber(env, encryptedPhoneNumber);
	try {
		const num = await prepareNumber(encryptedPhoneNumber)
		const response = await verifySMSCode(env, request.accesstoken, num, verificationCode);
		if (response.status === 204) {
			const userData = {
				"primaryPhone": num
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
