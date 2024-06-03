// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

export default {
	type: "object",
	properties: { // https://ihateregex.io/expr/phone/#
		encryptedPhoneNumber: {type: "string", pattern: "^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$"},
	},
	required: ["encryptedPhoneNumber"],
	additionalProperties: false
}
