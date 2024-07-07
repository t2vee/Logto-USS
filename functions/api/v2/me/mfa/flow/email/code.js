// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import verifyCode from "../../../../../../../api/libs/verifyCode.js";

export async function onRequestPost(ctx) {
    return verifyCode(ctx, 'email')
}