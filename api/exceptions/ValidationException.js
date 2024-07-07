// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

export class ValidationException extends Error {
	constructor(message = 'ERR_FAILED_VALIDATION', status = 422) {
		super(message);
		this.status = status;
	}
}
