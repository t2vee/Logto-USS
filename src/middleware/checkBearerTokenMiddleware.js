import {error} from "itty-router";
import verifyAuthToken from "../utils/verifyAuthToken";

export default async (request, env) => {
	try {
		const tokenInfo = await verifyAuthToken(request, env);
		request.userid = tokenInfo.sub;
		console.log('[MIDDLEWARE] Authentication Bearer Token Check Succeeded')
	} catch (e) {
		console.log(e)
		return error(400, 'Invalid or Non-existent Authentication Bearer Token');
	}
}
