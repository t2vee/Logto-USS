// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.
import { object, define } from 'superstruct'
import isEmail from 'is-email'

const email = () => define('email', (value) => isEmail(value))

export default object({
	email: email(),
})
