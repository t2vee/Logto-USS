import updateUserData from "../../../lib/updateUserData";
import emptySuccessResponse from "../../../responses/emptySuccessResponse";
import failedResponse from "../../../responses/failedResponse";
import failedResponseWithMessage from "../../../responses/failedResponseWithMessage";

export default async (request, env) => {
	const value = await env.UsernameChangeTimelimit.get(request.userid)
	console.log(value)
	if (value) {
		return failedResponseWithMessage(`Be patient! You still have to wait until ${value} before changing your username.`)
	}
	const usernameRegex = new RegExp(/^[a-zA-Z0-9]{3,24}$/)
	const requestData = await request.json();
	if (usernameRegex.test(requestData.username)) {
		const userData = {"username": requestData.username}
		const updateResponse = await updateUserData(env, request.accesstoken, userData, request.userid)
		if (updateResponse.status === 200) {
			const monthFromNow = Math.floor(new Date(new Date().setMonth(new Date().getMonth() + 1)).getTime() / 1000);
			const formattedDate = new Date(monthFromNow * 1000)
			await env.UsernameChangeTimelimit.put(request.userid, [('0' + formattedDate.getDate()).slice(-2), ('0' + (formattedDate.getMonth() + 1)).slice(-2), formattedDate.getFullYear().toString().slice(-2)].join('/'), {expirationTtl: monthFromNow})
		}
		return updateResponse.status === 200
			? emptySuccessResponse(env)
			: failedResponse;
	}
	return failedResponseWithMessage('Invalid username');
}
