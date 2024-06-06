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
	.post('/avatar/*', AvatarUserRouter.handle)


/*UserRouter.post('/edit/*', UpdateUserRouter.handle)
UserRouter.post('/dangerzone/*', DangerZoneRouter.handle)
UserRouter.post('/connectors/*', ConnectorRouter.handle)

UserRouter.post('/mfa-flow/*', MFAFlowRouter.handle)
UserRouter.post('/mfa/*', MFAMethodsRouter.handle)
UserRouter.post('/verify/*', NewMFARouter.handle)
*/
