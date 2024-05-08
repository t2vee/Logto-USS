import fetchAccessToken from "../../../utils/fetchAccessToken";
import updateUserData from "../../../lib/updateUserData";
import decryptNumber from "../../../utils/decryptNumber";
import verifySMSCode from "../../../lib/verifySMSCode";
import prepareNumber from "../../../utils/prepareNumber";
import checkVerificationCodeMiddleware from "../../../middleware/checkVerificationCodeMiddleware";
import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";
import failedResponseWithMessage from "../../../responses/failedResponseWithMessage";

export default async (request, env) => {
	const verificationCode = await checkVerificationCodeMiddleware(request)
	const requestData = await request.json();
	const encryptedPhoneNumber = requestData.encryptedPhoneNumber;
	const userNumber = await decryptNumber(env, encryptedPhoneNumber);
	try {
		const accessToken = await fetchAccessToken(env);
		const num = await prepareNumber(userNumber)
		const response = await verifySMSCode(env, accessToken, num, verificationCode);
		if (response.status === 204) {
			const userData = {
				"primaryPhone": num
			}
			const updateResponse = await updateUserData(env, accessToken, userData, request.userid)
			return response.status === 204 && updateResponse.status === 200
				? emptySuccessResponse(env)
				: failedResponse;
		} else {
			return failedResponse;
		}
	} catch (error) {
		return failedResponseWithMessage(error);
	}
}
