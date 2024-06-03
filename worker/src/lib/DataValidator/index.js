// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import * as validator from 'validators'
import Filter from "bad-words";
import { ValidationException } from '../../exceptions/ValidationException'

export default class DataValidator {
	constructor(env) {
		this._env = env;
		this._filter = new Filter();
	}

	username(data) {
		if (validator.validateUsername(data)) {throw new ValidationException()}
		if (this._filter.isProfane(data)) {{throw new ValidationException('ERR_CONTAINS_BAD_WORDS')}}
	}
	fullName(data) {
		if (validator.validateName(data)) {throw new ValidationException()}
		if (this._filter.isProfane(data)) {{throw new ValidationException('ERR_CONTAINS_BAD_WORDS')}}
	}
	password(data) {
		if (validator.validatePassword(data)) {throw new ValidationException()}
	}
	email(data) {
		if (validator.validateEmail(data)) {throw new ValidationException()}
	}
	phone(data) {
		if (validator.validatePhone(data)) {throw new ValidationException()}
	}
	birthday(data) {
		if (validator.validateBirthday(data)) {throw new ValidationException()}
	}
}
