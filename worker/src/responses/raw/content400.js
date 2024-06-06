// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


export default (content, code = 400) =>
	Response.json(
		content,
		{
			status: code,
			statusText: content,
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			},
		}
	)
