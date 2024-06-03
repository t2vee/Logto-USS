// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

export default {
	type: "object",
	properties: {
		email: {type: "string", format: "email"},
	},
	required: ["email"],
	additionalProperties: false
}
