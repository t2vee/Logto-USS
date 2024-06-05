// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.
import { object, string, pattern } from 'superstruct'


export default object({
	oldPassword: string(),
	password: pattern(string(), /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)
})
