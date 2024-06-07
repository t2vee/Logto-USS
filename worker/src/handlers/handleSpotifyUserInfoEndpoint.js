// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import extractBearerTokenFromHeaders from "../utils/extractHeaders";
import {error, json} from "itty-router";

export default async (request, env) => {
	if (request.query.token !== env.TOKEN || !request.query || !request.query.token) {
		return error(401, 'ERR_UNAUTHORISED');
	}
	const url = `https://api.spotify.com/v1/me`;
	const headers = request.headers
	try {
		const t = extractBearerTokenFromHeaders(request.headers);
		const response = await fetch(url, { method: 'GET', headers });
		if (!response.ok) {
			throw { message: 'Failed to access resource - ERR 6789', status: response.status };
		}
		const data = await response.json();
		const payload = {
			"id": data.id,
			"country": data.country,
			"display_name": data.display_name,
			"email": data.email,
			"spotify_url": data.external_urls.spotify,
			"follower_count": data.followers.total,
			"product": data.product,
			"filter": data.explicit_content.filter_enabled,
			"image_url": data.images.length > 0 ? data.images[0].url : null
		}
		return json(payload);
	} catch (e) {
		console.error(e)
		return error(500)
	}
}
