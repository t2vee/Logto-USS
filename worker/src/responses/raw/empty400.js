// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


export default (code = 400) =>
	new Response(
		null,
		{
			status: code,
			headers: {
				"Content-Type": "text/plain; charset=utf-8"
			},
		}
	)
