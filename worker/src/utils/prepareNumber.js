// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


export default async function prepareNumber(userNumber) {
	const phonePattern = /^\d+$/;
	const cleanedNumber = userNumber.replaceAll(' ', '').replace('+', '');
	if (!phonePattern.test(cleanedNumber)) {
		throw { message: 'ERR_NUMBER_INVALID', status: 400 };
	}
	return cleanedNumber
}
