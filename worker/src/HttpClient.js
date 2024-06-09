// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import {StatusError} from "itty-router";

const _500 = 'ERR_SERVICE_FAILURE';
const _403 = 'ERR_INTERNAL_MISCONFIG';

// a simple fetch wrapper to reduce repetitive error handling code and make it easier to work with
class HttpClient {
	constructor(env, accessToken) {
		this._env = env;
		this._accessToken = accessToken;
	}
	async #_request(method, url, data = undefined, headers = {}, resTo400 = 'ERR_MALFORMED_REQUEST') {
		const config = {
			method: method,
			headers: {
				'Authorization': `Bearer ${this._accessToken}`,
				'Content-Type': 'application/json',
				...headers,
			},
		};
		if (data) {
			if (method === 'GET') {
				url += '?' + new URLSearchParams(data);
			} else {
				config.body = JSON.stringify(data);
			}
		}
		console.log(`[HTTPCLIENT] Sending Out ${method} Request to ${url}`)
		const response = await fetch(this._env.LOGTO_DOMAIN + url, config);
		const contentType = response.headers.get('content-type');
		if (!response.ok) {
			console.error('Fetch error:', response.statusText);
			switch (response.status) {
				case 404:
				case 400:
					throw new StatusError(400, resTo400)
				case 403:
				case 401:
					throw new StatusError(500, _403)
				case 500:
					throw new StatusError(500, _500)
			}
		}
		if (contentType && contentType.includes('application/json')) {
			const res = await response.json()
			return JSON.parse(JSON.stringify(res)); // need to provide compatibility with the client. fancy way of saying im too lazy to fix json parsing client side
		} else {
			return await response.text();
		}
	}

	async get(url, {params = undefined, headers = {}, resTo400= undefined}) {
		return this.#_request('GET', url, params, headers, resTo400);
	}

	async post(url, {data = {}, headers = {}, resTo400= undefined}) {
		return this.#_request('POST', url, data, headers, resTo400);
	}

	async patch(url, {data = {}, headers = {}, resTo400= undefined}) {
		return this.#_request('PATCH', url, data, headers, resTo400);
	}

	async put(url, {data = {}, headers = {}, resTo400= undefined}) {
		return this.#_request('PUT', url, data, headers, resTo400);
	}

	async delete(url, {params = {}, headers = {}, resTo400= undefined}) {
		return this.#_request('DELETE', url, params, headers, resTo400);
	}
}
export function createHttpClient(env, accessToken) {
	return new HttpClient(env, accessToken);
}
