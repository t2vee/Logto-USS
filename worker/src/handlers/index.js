// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import {AutoRouter} from 'itty-router'
import { UserRouter } from './user'

export const HandlerRouter = AutoRouter({ base: '/api/v2' })

HandlerRouter.all('/me/*', UserRouter.fetch)
