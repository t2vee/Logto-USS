import grabUserDetails from "../../lib/grabUserDetails";
import successCONTENT from "../../responses/raw/success-CONTENT";
import failureEMPTY from "../../responses/raw/failure-EMPTY";

export default async (request, env) => {
	try {
		const userData = await grabUserDetails(env, request.accesstoken, request.userid)
		const usrDObj = JSON.parse(userData)
		return successCONTENT(env, usrDObj);
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 418)
	}
}
