// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { Router } from 'itty-router'
import { handler as UpdateLocale } from "./updateLocale";
import { handler as UpdateBirthday } from "./updateBirthday";
import { handler as UpdateFullName } from "./updateFullName";
import { handler as UpdatePassword } from "./updatePassword";
import { handler as UpdateRegionalSettings } from "./updateRegionalSettings";
import { handler as UpdateUsername } from "./updateUsername";
import removeSMS from "../mfa/new/remove-number";


export const UpdateUserRouter = Router({ base: '/api/v2/me/edit' })

UpdateUserRouter
	.post("/birthday", UpdateBirthday)
	.post("/full-name", UpdateFullName)
	.post("/language", UpdateLocale)
	.post("/password", UpdatePassword)
	.post("/regional-settings", UpdateRegionalSettings)
	.post("/username", UpdateUsername)
  .post("/remove-sms",removeSMS)
