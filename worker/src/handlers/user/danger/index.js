// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { Router } from 'itty-router'
import { handler as SuspendUser } from "./suspendUser";
import { handler as TerminateUser } from "./terminateUser";

export const DangerZoneRouter = Router({ base: '/api/v2/me/dangerzone' })

DangerZoneRouter
	.post("/suspendme", SuspendUser)
	.post("/terminate", TerminateUser)
