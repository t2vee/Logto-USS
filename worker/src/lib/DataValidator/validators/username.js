// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import Ajv from 'ajv'
import addFormats from "ajv-formats"
import usernameSchema from '../schemas/username'

const ajv = new Ajv()
addFormats(ajv, ['regex'])

const validate = ajv.compile(usernameSchema)

export default async (username) => {
	validate(username)
};
