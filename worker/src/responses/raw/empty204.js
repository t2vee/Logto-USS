// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

export default () =>
	new Response(
		null,
		{
			status: 204,
			headers: {
				"Content-Type": "text/plain; charset=utf-8"
			},
		})
