// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { AutoRouter } from 'itty-router'

import { handler as ExtendedUserInfo } from "./extendedUserData";
import { handler as CanChangeUsername } from "./canChangeUsername";
import { handler as IsMFARequired } from "./isMfaRequired";


import { UpdateUserRouter } from './update'
import { AvatarUserRouter } from './avatar'
import { DangerZoneRouter } from './danger'
import { ConnectorRouter } from './connectors'
import { MFAFlowRouter } from './mfa/flow'
import { MFAMethodsRouter } from './mfa/methods'
import { NewMFARouter } from './mfa/new'

export const UserRouter = AutoRouter({ base: '/api/v2/me' })

UserRouter
	.get("/extended-user-info", ExtendedUserInfo)
	.get("/can-change-username", CanChangeUsername)
	.get("/is-mfa-required", IsMFARequired)
	// Sub Routers
	.all("/mfa/*", MFAMethodsRouter.fetch)
	// these sub routers only use post as a accepting method
	.post('/avatar/*', AvatarUserRouter.fetch)
	.post('/connectors/*', ConnectorRouter.fetch)
	.post('/dangerzone/*', DangerZoneRouter.fetch)
	.post('/edit/*', UpdateUserRouter.fetch)
	.post('/mfa-flow/*', MFAFlowRouter.fetch)
	.post('/verify/*', NewMFARouter.fetch)
