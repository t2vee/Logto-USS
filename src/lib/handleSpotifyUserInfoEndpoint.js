import successJSONResponse from "../responses/successJSONResponse";

export default async (request, env) => {
	const url = `https://api.spotify.com/v1/me`;
	const headers = request.headers
	try {
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
		return successJSONResponse(env, payload);
	} catch (error) {
		console.error('Error accessing resource:', error);
		throw typeof error === 'string' ? { message: error, status: 500 } : error;
	}
}
