// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import Ajv from 'ajv'
import addFormats from "ajv-formats"
import phoneSchema from '../schemas/phone'

const ajv = new Ajv()
addFormats(ajv, ['regex'])

const validate = ajv.compile(phoneSchema)

export default async (email) => {
	validate(email)
};
