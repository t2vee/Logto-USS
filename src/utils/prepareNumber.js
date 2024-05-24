// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license. 


/**
 * Cleans and validates a user-provided phone number by removing spaces and the leading '+' sign.
 * It checks the cleaned number against a pattern to ensure it consists only of digits.
 * If the cleaned number fails the pattern test, it throws an error indicating an invalid phone number format.
 *
 * @param {string} userNumber The user-provided phone number to be cleaned and validated.
 * @returns {string} The cleaned phone number if it passes the validation.
 * @throws {Object} An error object with a message and status code if the phone number is invalid.
 */

export default async function prepareNumber(userNumber) {
	const phonePattern = /^\d+$/;
	const cleanedNumber = userNumber.replaceAll(' ', '').replace('+', '');
	if (!phonePattern.test(cleanedNumber)) {
		throw { message: 'Invalid phone number format - ERR 3489', status: 400 };
	}
	return cleanedNumber
}
