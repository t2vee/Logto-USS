// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { Router } from 'itty-router'
import verifySms from "./verify-sms";
import verifyEmail from "./verify-email";
import pushSMS from "./push-sms";
import pushEmail from "./push-email";

export const NewMFARouter = Router({ base: '/api/v2/me/verify' })

NewMFARouter
	.post("/verify-sms", verifySms)
	.post("/verify-email", verifyEmail)
	.post("/push-sms", pushSMS)
	.post("/push-email", pushEmail)
