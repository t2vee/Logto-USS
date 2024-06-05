// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { object, string, pattern } from 'superstruct'

export default object({
	birthday: pattern(string(), /^\d{1,2} [A-Za-z]{3,9} \d{4}$/)
})
