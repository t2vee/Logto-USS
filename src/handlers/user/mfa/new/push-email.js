// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import pushCode from "../../../../lib/pushCode";

export default async (request, env) => {
	const requestData = await request.json();
	const email = requestData.email;
	return pushCode(request, env, 'email', email);
}
