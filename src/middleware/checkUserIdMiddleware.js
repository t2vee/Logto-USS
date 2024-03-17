import {error} from "itty-router";

export default async (request) => {
	let userId = request.params.userid
	const userIdPattern = /^[a-zA-Z0-9]{12}$/;
	if (!userIdPattern.test(userId)) {
		const url = new URL(request.url);
		userId = url.searchParams.get('user-id');
		if (!userIdPattern.test(userId)) {
			console.log('[MIDDLEWARE] User ID Check FAILED')
			throw { message: 'Failed to access resource - ERR 89654', status: response.status };
		}
	}
	console.log('[MIDDLEWARE] User ID Check Succeeded')
	return userId
}

