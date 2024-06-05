// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { Router } from 'itty-router'
import { UserRouter } from './user'

// NOTE: this base must include the *complete* base path
export const HandlerRouter = Router({ base: '/api/v2' })

HandlerRouter.all('/me/*', UserRouter.fetch)
