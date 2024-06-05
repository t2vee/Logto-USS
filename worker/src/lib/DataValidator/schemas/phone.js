// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.
import { object, string, pattern } from 'superstruct'

export default object({
	encryptedPhoneNumber: pattern(string(), /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
})
