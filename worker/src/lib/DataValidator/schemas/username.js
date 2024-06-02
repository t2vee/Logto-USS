// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

export default {
	$async: true,
	type: "object",
	properties: {
		username: {type: "string", pattern: "^[a-zA-Z0-9]{3,24}$"},
	},
	required: ["username"],
	additionalProperties: false
}
