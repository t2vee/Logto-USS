// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import CORS from "../../headers/CORS";

export default (env, code = 400) =>
	new Response(
		null,
		{
			status: code,
			headers: CORS(env, "text/plain")
		}
	)
