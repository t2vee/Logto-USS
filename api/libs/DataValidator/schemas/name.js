// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.
import { object, string, pattern } from 'superstruct'

export default object({
	name: pattern(string(), /^[a-zA-Z0-9 '-]{2,64}$/),
})
