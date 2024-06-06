// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { AutoRouter } from 'itty-router'
import { UserRouter } from './user'
import { handler as DoesUsernameExist } from "./user/usernameExists";

export const HandlerRouter = AutoRouter({ base: '/api/v2' })

HandlerRouter
	.get("/utils/check-username-exists/:username", DoesUsernameExist)
	.all('/me/*', UserRouter.fetch)
