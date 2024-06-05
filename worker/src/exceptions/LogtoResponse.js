// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

export const _500 = 'ERR_SERVICE_FAILURE';
export const _403 = 'ERR_INTERNAL_MISCONFIG';

export class LogtoException extends Error {
	constructor(message, status) {
		super(message);
		this.status = status;
	}
}
