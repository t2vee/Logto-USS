// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


export default async function prepareNumber(userNumber) {
	return userNumber.replaceAll(' ', '').replace('+', '')
}
