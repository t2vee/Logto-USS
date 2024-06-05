// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import Filter from "bad-words";
import { ValidationException } from '../../exceptions/ValidationException'
import * as schema from './schemas';


import { assert } from 'superstruct'

// probably a terrible implementation i know but the sunk cost fallacy is so real and i cant escape it
class DataValidator {
	constructor(env) {
		this._env = env;
		this._filter = new Filter();
	}

	#validate(data, schema, err, checkBadWords = false) {
		try {
			assert(data, schema, err)
		} catch (e) {
			throw new ValidationException(e.Ge);
		}
		if (checkBadWords) {
			console.log('im checking for naughty words')
			if (this._filter.isProfane(data.name ? data.name : data.username)) {{throw new ValidationException('ERR_CONTAINS_BAD_WORDS', 406)}}
		}
		console.log('[VALIDATOR] Submitted data successfully validated')
	}

	#calculateAge(data) {
		const ageDifMs = Date.now() - data.getTime();
		const ageDate = new Date(ageDifMs);
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}

	#verifyDate(data) {
		const dateParts = data.birthday.split(' ');
		const date = new Date(`${dateParts[1]} ${dateParts[0]}, ${dateParts[2]}`);
		if (!isNaN(date.getTime())) {
			const age = this.#calculateAge(date);
			console.log(age)
			if (age <= 13 || age >= 99) {throw new ValidationException('ERR_AGE_OUT_OF_RANGE', 422)}
		} else {
			throw new ValidationException('ERR_INVALID_DATE', 422);
		}
	}

	username(data) {
		return this.#validate(data, schema.UsernameSchema, 'ERR_INVALID_USERNAME', true)
	}

	fullName(data) {
		return this.#validate(data, schema.NameSchema, 'ERR_INVALID_NAME', true)
	}

	password(data) {
		return this.#validate(data, schema.PasswordSchema, 'ERR_INVALID_PASSWORD')
	}

	email(data) {
		return this.#validate(data, schema.EmailSchema, 'ERR_INVALID_EMAIL')
	}

	phone(data) {
		return this.#validate(data, schema.PhoneSchema, 'ERR_INVALID_NUMBER')
	}

	regional(data) {
		return this.#validate(data, schema.RegionalSchema, 'ERR_INVALID_OPTION')
	}

	locale(data) {
		return this.#validate(data, schema.LocaleSchema, 'ERR_INVALID_OPTION')
	}

	birthday(data) {
		try {
			this.#validate(data, schema.BirthdaySchema, 'ERR_INVALID_DATE');
			this.#verifyDate(data);
		} catch (e) {
			throw e;
		}
	}
}

export function createDataValidator(env) {
	return new DataValidator(env);
}
