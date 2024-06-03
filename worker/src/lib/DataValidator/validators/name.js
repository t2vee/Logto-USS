// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import Ajv from 'ajv'
import addFormats from "ajv-formats"
import nameSchema from '../schemas/name'

const ajv = new Ajv()
addFormats(ajv, ['regex'])

const validate = ajv.compile(nameSchema)

export default async (name) => {
	validate(name)
};
