// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

export default (content) =>
	Response.json(
		content,
		{
			status: 200,
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			},
		}
	)
