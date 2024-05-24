// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import CORS from "../../headers/CORS";

export default (env, content, code = 400) =>
	Response.json(
		content,
		{
			status: code,
			headers: CORS(env, "application/json")
		}
	)
