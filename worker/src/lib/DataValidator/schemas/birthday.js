// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

export default {
	type: "object",
	properties: {
		profile: {
			type: "object",
			properties: {
				birthday: {type: "string", pattern: "^\\d{1,2} [A-Za-z]{3,9} \\d{4}$"},
			}
		},
	},
	required: ["profile", "birthday"],
	additionalProperties: false
}
