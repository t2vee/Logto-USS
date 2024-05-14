import updateUserProfile from "../../../lib/updateUserProfile";
import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureEMPTY from "../../../responses/raw/failure-EMPTY";

export default async (request, env) => {
	try {
		const requestData = await request.json();
		const userData = {
			"profile": {
				"address": {
					"locality": requestData.timezone,
				}
			}
		}
		if (requestData.country) {
			userData.profile.address.country = requestData.country;
		}
		const updateResponse = await updateUserProfile(env, request.accesstoken, userData, request.userid)
		return updateResponse.status === 200
			? successEMPTY(env)
			: failureEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 418)
	}
}
