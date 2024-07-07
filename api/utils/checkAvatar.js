// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


export default async (env, imageData) => {
	console.log('[NSFWCHECK] Checking uploaded image...')
	const url = `${env.AVATAR_API}/avatar-service/v1/avatar/check-nsfw`;
	const uploadFormData = new FormData();
	uploadFormData.append('file', imageData);
	const response = await fetch(url, {
		method: 'POST',
		body: uploadFormData
	});
	if (!response.ok) {

		console.error('Error accessing resource:', response);
		return false;
	}
	const data = await response.json();
	return data[0].className === 'Neutral' || data[0].className === 'Drawing';
}
