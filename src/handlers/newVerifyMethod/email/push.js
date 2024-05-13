import sendEmailVerificationCode from "../../../lib/sendEmailVerificationCode";
import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";
import failedResponseWithMessage from "../../../responses/failedResponseWithMessage";

export default async (request, env) => {
	const requestData = await request.json();
	const email = requestData.email;
	try {
		const response = await sendEmailVerificationCode(env, request.accesstoken, email);
		return response.status === 204
			? emptySuccessResponse(env)
			: failedResponse;
	} catch (error) {
		failedResponseWithMessage(error);
	}
}
