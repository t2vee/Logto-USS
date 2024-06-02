// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import Ajv, { ValidationError } from 'ajv'
import addFormats from "ajv-formats"
import usernameSchema from '../schemas/username'
import { ValidationException } from '../../../exceptions/ValidationException'

const ajv = new Ajv()
ajv.addKeyword({async: true})
addFormats(ajv, ['regex'])

const validateUsername = ajv.compile(usernameSchema)

export default async (username) => {
	await validateUsername(username)
};
