import updateUserData from "../../../lib/updateUserData";
import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureEMPTY from "../../../responses/raw/failure-EMPTY";
import failureCONTENT from "../../../responses/raw/failure-CONTENT";

import Filter from "bad-words";
const filter = new Filter();

export default async (request, env) => {
	try {
		const requestData = await request.json();
		const userData = {
			"name": requestData.name,
		}
		if (filter.isProfane(requestData.name)) {return failureCONTENT(env,'Username contains bad words >:(', 406)}
		const updateResponse = await updateUserData(env, request.accesstoken, userData, request.userid)
		return updateResponse.status === 200
			? successEMPTY(env)
			: failureEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 500)
	}
}
