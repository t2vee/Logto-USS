// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { Router } from 'itty-router'
import { UpdateUserRouter } from './update'
import { AvatarUserRouter } from './avatar'
export const UserRouter = Router({ base: '/api/v2/me' })

UserRouter.post('/edit/*', UpdateUserRouter.fetch)
UserRouter.post('/avatar/*', AvatarUserRouter.fetch)
