// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { Router } from 'itty-router'
import { handler as RemoveAvatar} from "./removeAvatar";
import { handler as UploadAvatar} from "./uploadNewAvatar";
export const AvatarUserRouter = Router({ base: '/api/v2/me/avatar' })

AvatarUserRouter
	.post("/remove", RemoveAvatar)
	.post("/upload", UploadAvatar)
