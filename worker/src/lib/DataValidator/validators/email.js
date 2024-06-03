// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import Ajv from 'ajv'
import addFormats from "ajv-formats"
import emailSchema from '../schemas/email'

const ajv = new Ajv()
addFormats(ajv, ['email'])

const validate = ajv.compile(emailSchema)

export default async (email) => {
	validate(email)
};
