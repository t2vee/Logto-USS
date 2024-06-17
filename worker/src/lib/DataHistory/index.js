// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { ValidationException } from '../../exceptions/ValidationException'
import * as schema from './schemas';


import { assert } from 'superstruct'

class DataHistory {
	constructor(env) {
		this._env = env;
	}

	#log(data, schema, err, checkBadWords = false) {
		try {
			assert(data, schema, err)
		} catch (e) {
			throw new ValidationException(e.Ge);
		}
		if (checkBadWords) {
			if (this._filter.isProfane(data.name ? data.name : data.username)) {{throw new ValidationException('ERR_CONTAINS_BAD_WORDS', 406)}}
		}
		console.log('[VALIDATOR] Submitted data successfully validated')
	}
}

export function createDataHistory(env) {
	return new DataHistory(env);
}
