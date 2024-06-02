// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { validateUsername, validatePassword } from 'validators'
import Filter from "bad-words";
import { ValidationException } from '../../exceptions/ValidationException'

export default class DataValidator {
	constructor(env) {
		this._env = env;
		this._filter = new Filter();
	}

	async username(username) {
		if (validateUsername(username)) {throw new ValidationException()}
		if (this._filter.isProfane(username)) {{throw new ValidationException('ERR_CONTAINS_BAD_WORDS')}}
	}
	async password(password) {
		if (validatePassword(password)) {throw new ValidationException()}
	}
}
