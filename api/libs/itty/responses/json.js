// Copyright (c) 2024 kwitley. All rights reserved.
// Use of this source code is governed by an MIT license.

import { createResponse } from '../createResponse'

export const json = createResponse(
    'application/json; charset=utf-8',
    JSON.stringify
)