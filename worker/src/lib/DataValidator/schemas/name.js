// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

export default {
	type: "object",
	properties: {
		name: {type: "string", pattern: "^[a-zA-Z0-9 '-]{2,64}$"},
	},
	required: ["name"],
	additionalProperties: false
}
