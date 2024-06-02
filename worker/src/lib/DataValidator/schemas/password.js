// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

export default {
	type: "object",
	properties: {
		oldPassword: {type: "string", format: "password"},
		password: {type: "string", format: "password"},
	},
	required: ["password"],
	additionalProperties: false
}
