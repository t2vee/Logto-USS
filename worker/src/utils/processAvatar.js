// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import * as photon from "@cf-wasm/photon";

const processImageOffsite = async (env, imageData) => {
	const url = `${env.AVATAR_API}/avatar-service/v1/avatar/preprocess`;
	const uploadFormData = new FormData();
	uploadFormData.append('file', imageData);
	const response = await fetch(url, {
		method: 'POST',
		body: uploadFormData
	});
	if (!response.ok) {
		if (response.status === 406) {
			console.warn('Unsupported File Type');
			return false;
		}
		console.error('Error accessing resource:', response);
		throw { message: 'Failed to access resource - Trace ID: 659347', status: response.status };
	}
	const data = await response.formData();

	return data ? data.get('image') : false;
}

export default async (req, file) => {
	const image = photon.PhotonImage.new_from_byteslice(new Uint8Array(await file.arrayBuffer()));

	const width = image.get_width();
	const height = image.get_height();
	const minDim = Math.min(width, height);
	const left = Math.floor((width - minDim) / 2);
	const top = Math.floor((height - minDim) / 2);

	const croppedImage = photon.crop(image, left, top, minDim, minDim);
	const resizedImage = photon.resize(croppedImage, 300, 300, 1); // Resize to 300x300

	const outputBytes = resizedImage.get_bytes_webp(/*90*/);

	image.free();
	croppedImage.free();
	resizedImage.free();

	const blob = new Blob([outputBytes], { type: 'image/webp' });
	console.log(blob)
	return blob
}
