// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import {useLogto} from "@logto/vue";

class StatusError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const _500 = 'ERR_SERVICE_FAILURE';
const _403 = 'ERR_INTERNAL_MISCONFIG';
const { getAccessToken } = useLogto()

export class HttpClient {
    constructor(options) {
        this._accessToken = '';
        this._logto = options.logto;
        this._coreResource = options.coreResource;
    }
    async #_request(method, url, data = null, headers = {}, resTo400 = 'ERR_MALFORMED_REQUEST') {
        this._accessToken = await getAccessToken(this._coreResource)
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
                const params = new URLSearchParams(data)
                if (params) {
                    url += '?' + params;
                }
            } else {
                config.body = JSON.stringify(data);
            }
        }
        console.log(`[HTTPCLIENT] Sending Out ${method} Request to ${url}`)
        const response = await fetch(this._logto + url, config);
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
            return JSON.parse(JSON.stringify(res));
        } else {
            return await response.text();
        }
    }

    async get(url, {params = {}, headers = {}, resTo400= undefined}) {
        return this.#_request('GET', url, params, headers, resTo400);
    }

    async post(url, {data = {}, headers = {}, resTo400= undefined}) {
        return this.#_request('POST', url, data, headers, resTo400);
    }
}
