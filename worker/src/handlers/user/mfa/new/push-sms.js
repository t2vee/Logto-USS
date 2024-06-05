// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import pushCode from "../../../../lib/pushCode";
import prepareNumber from "../../../../utils/prepareNumber";
import failureCONTENT from '../../../../responses/raw/failure-CONTENT'

export default async (request, env) => {
	const requestData = await request.json();
	try {
		request.Validate.phone(requestData);
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)
	}
	const phone = requestData.encryptedPhoneNumber;
	return pushCode(request, env, 'email', await prepareNumber(phone));
}
