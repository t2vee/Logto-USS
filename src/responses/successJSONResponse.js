// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import jsonSuccess from "../headers/jsonSuccess";

export default (env, body) =>
	Response.json(body, {
		status: 200,
		headers: jsonSuccess(env)
	}
)
