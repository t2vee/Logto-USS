import updateUserData from "../../../lib/updateUserData";
import failureCONTENT from "../../../responses/raw/failure-CONTENT";
import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureEMPTY from "../../../responses/raw/failure-EMPTY";

export default async (request, env) => {
	try {
		const value = await env.UsernameChangeTimelimit.get(request.userid)
		if (value) {
			return failureCONTENT(env,`Be patient! You still have to wait until ${value} before changing your username.`, 400)
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
				? successEMPTY(env)
				: failureEMPTY(env);
		}
		return failureCONTENT(env,'Invalid username', 406);
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 418)
	}
}
