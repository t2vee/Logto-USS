// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import Ajv from 'ajv'
import addFormats from "ajv-formats"
import birthdaySchema from '../schemas/birthday'

const ajv = new Ajv()
addFormats(ajv, ['date'])

const validate = ajv.compile(birthdaySchema)

function calculateAge(birthday) {
	const ageDifMs = Date.now() - birthday.getTime();
	const ageDate = new Date(ageDifMs);
	return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default async (birthdate) => {
	if (!validate(birthdate)) {return false;}
	const dateParts = birthdate.split(' ');
	const date = new Date(`${dateParts[1]} ${dateParts[0]}, ${dateParts[2]}`);
	if (!isNaN(date.getTime())) {
		const age = calculateAge(date);
		return age >= 13 && age <= 99;
	} else {
		return false;
	}
};
