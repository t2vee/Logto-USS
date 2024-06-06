// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { Router } from 'itty-router'
import { handler as PushSMS } from "./push-sms";
import { handler as PushEmail } from "./push-email";
import { handler as VerifySMS } from "./verify-sms";
import { handler as VerifyEmail } from "./verify-email";

export const MFAFlowRouter = Router({ base: '/api/v2/me/mfa-flow' })

MFAFlowRouter
	.post("/push-email", PushEmail)
	.post("/push-sms", PushSMS)
	.post("/verify-email-code", VerifyEmail)
	.post("/verify-sms-code", VerifySMS)
