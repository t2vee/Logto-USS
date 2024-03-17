import fetchAccessToken from "../../../utils/fetchAccessToken";
import sendEmailVerificationCode from "../../../lib/sendEmailVerificationCode";
import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";
import failedResponseWithMessage from "../../../responses/failedResponseWithMessage";

export default async (request, env) => {
	const requestData = await request.json();
	const email = requestData.email;
	try {
		const accessToken = await fetchAccessToken(env);
		const response = await sendEmailVerificationCode(env, accessToken, email);
		return response.status === 204
			? emptySuccessResponse
			: failedResponse;
	} catch (error) {
		failedResponseWithMessage(error);
	}
}
