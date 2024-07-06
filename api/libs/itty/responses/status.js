// Copyright (c) 2024 kwitley. All rights reserved.
// Use of this source code is governed by an MIT license.

export const status = (status, options = undefined) =>
    new Response(null, { ...options, status })