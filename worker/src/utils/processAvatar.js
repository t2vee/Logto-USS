// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import * as photon from '@cf-wasm/photon'

export default async (req, file) => {
	try {
		const image = photon.PhotonImage.new_from_byteslice(new Uint8Array(await file.arrayBuffer()));
		const width = image.get_width();
		const height = image.get_height();
		const minDim = Math.min(width, height);
		const left = Math.floor((width - minDim) / 2);
		const top = Math.floor((height - minDim) / 2);
		const croppedImage = photon.crop(image, left, top, minDim, minDim);
		const resizedImage = photon.resize(croppedImage, 300, 300, 1);
		const outputBytes = resizedImage.get_bytes_webp(/*90*/);
		image.free();
		croppedImage.free();
		resizedImage.free();
		return new Blob([outputBytes], { type: 'image/webp' })
	} catch (e) {
		console.log(e)
		return false;
	}
}
