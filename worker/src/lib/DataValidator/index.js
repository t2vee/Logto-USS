// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import Ajv, { ValidationError } from 'ajv'
import validateUsername from 'schemas/username'
import Filter from "bad-words";
import { ValidationException } from '../../exceptions/ValidationException'

export default class DataValidator {
	constructor(env) {
		this._env = env;
		this._filter = new Filter();
	}

	async username(username) {
		try {
			await validateUsername(username)
			this._filter.isProfane(username)
		} catch (e) {
			if (!(e instanceof Ajv.ValidationError)) throw new Error(e.errors.message)
			console.log("Validation errors:", e.errors)
		}
	}
}
