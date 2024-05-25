// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import pushCode from "../../../lib/pushCode";
import prepareNumber from "../../../utils/prepareNumber";

export default async (request, env) => {
	const requestData = await request.json();
	const phone = requestData.encryptedPhoneNumber;
	return pushCode(request, env, 'email', await prepareNumber(phone));
}
