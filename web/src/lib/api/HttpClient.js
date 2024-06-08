// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


class StatusError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const _500 = 'ERR_SERVICE_FAILURE';
const _403 = 'ERR_INTERNAL_MISCONFIG';

export class HttpClient {
    constructor(options) {
        this._accessToken = '';
        this._apiDomain = options.apiDomain;
    }
    async #_request(method, url, data = null, headers = {}, resTo400 = 'ERR_MALFORMED_REQUEST', accessToken) {
        this._accessToken = accessToken
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
        console.log(`[HTTPCLIENT] Sending Out ${method} Request to ${this._apiDomain + url}`)
        const response = await fetch(this._apiDomain + url, config);
        const contentType = response.headers.get('content-type');
        if (!response.ok) {
            console.error('[HTTPCLIENT] Fetch error:', response.statusText);
            throw new StatusError(response.status ,response.statusText);
        }
        console.log('[HTTPCLIENT] Fetch Request was a Success')
        if (contentType && contentType.includes('application/json')) {
            console.log(`[HTTPCLIENT] Received ${response.status} response:`, contentType);
            const jsonData = await response.json()
            return { data: jsonData, status: response.status };
        } else {
            console.log(`[HTTPCLIENT] Received ${response.status} response`);
            const textData = await response.text()
            return { data: textData, status: response.status };
        }
    }

    async get(url, accessToken, {params = {}, headers = {}, resTo400= undefined}) {
        return this.#_request('GET', url, params, headers, resTo400, accessToken);
    }

    async post(url, accessToken, {data = {}, headers = {}, resTo400= undefined}) {
        return this.#_request('POST', url, data, headers, resTo400, accessToken);
    }
}
