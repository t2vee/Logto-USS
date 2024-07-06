// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.
import { object, enums, optional } from 'superstruct'
import timezones from '../values/timezones'
import countries from '../values/countries'

export default object({
	timezone: enums(timezones),
	country: optional(enums(countries)),
})
