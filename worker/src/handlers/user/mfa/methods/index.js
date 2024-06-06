// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { Router } from 'itty-router'
import createNewMfaMethod from "./createNewMfaMethod";
import mfaMethods from "./mfaMethods";
import removeMethod from "./removeMfaMethod";

export const MFAMethodsRouter = Router({ base: '/api/v2/me/mfa' })

MFAMethodsRouter
	.post("/remove", removeMethod)
	.get("/methods", mfaMethods)
	.post("/create", createNewMfaMethod)
