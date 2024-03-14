export default async function prepareNumber(userNumber) {
	const phonePattern = /^\d+$/;
	const cleanedNumber = userNumber.replaceAll(' ', '').replace('+', '');
	if (!phonePattern.test(cleanedNumber)) {
		throw { message: 'Invalid phone number format - ERR 3489', status: 400 };
	}
	return cleanedNumber
}
