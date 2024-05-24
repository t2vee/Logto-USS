// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import updateUserData from "../../../lib/updateUserData";
import successEMPTY from "../../../responses/raw/success-EMPTY";
import failureEMPTY from "../../../responses/raw/failure-EMPTY";

export default async (request, env) => {
	try {
		const payload = {
			"avatar": null
		}
		const response = await updateUserData(env, request.accesstoken, payload, request.userid)
		return response.status === 200
			? successEMPTY(env)
			: failureEMPTY(env);
	} catch (e) {
		console.error(e)
		return failureEMPTY(env, 500)
	}
}
