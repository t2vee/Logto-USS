import {error} from "itty-router";
import verifyAuthToken from "../utils/verifyAuthToken";

const checkTokenMiddleware = async (request, env) => {
	try {
		await verifyAuthToken(request, env);
		console.log('[MIDDLEWARE] Authentication Bearer Token Check Succeeded')
	} catch (e) {
		return error(400, 'Invalid or Non-existent Authentication Bearer Token');
	}
}

export default checkTokenMiddleware
