// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.
import { object, string, pattern } from 'superstruct'

export default object({
	username: pattern(string(), /^[a-zA-Z0-9]{3,24}$/),
})
