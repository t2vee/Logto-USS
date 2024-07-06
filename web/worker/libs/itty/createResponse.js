// Copyright (c) 2024 kwitley. All rights reserved.
// Use of this source code is governed by an MIT license.


export const createResponse = (format = 'text/plain; charset=utf-8', transform) =>
    (body, options = {}) => {
        if (body === undefined || body instanceof Response) return body

        const response = new Response(transform?.(body) ?? body, options.url ? undefined : options)
        response.headers.set('content-type', format)
        return response
    }