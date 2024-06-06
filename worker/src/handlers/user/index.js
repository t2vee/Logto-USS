// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { Router } from 'itty-router'
import { UpdateUserRouter } from './update'
import { AvatarUserRouter } from './avatar'
import { DangerZoneRouter } from './danger'
import { ConnectorRouter } from './connectors'
import { MFAFlowRouter } from './mfa/flow'
import { MFAMethodsRouter } from './mfa/methods'
import { NewMFARouter } from './mfa/new'

export const UserRouter = Router({ base: '/api/v2/me' })

UserRouter.post('/edit/*', UpdateUserRouter.handle)
UserRouter.post('/avatar/*', AvatarUserRouter.handle)
UserRouter.post('/dangerzone/*', DangerZoneRouter.handle)
UserRouter.post('/connectors/*', ConnectorRouter.handle)

UserRouter.post('/mfa-flow/*', MFAFlowRouter.handle)
UserRouter.post('/mfa/*', MFAMethodsRouter.handle)
UserRouter.post('/verify/*', NewMFARouter.handle)
