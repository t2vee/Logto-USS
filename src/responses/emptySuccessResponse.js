// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import emptySuccess from "../headers/emptySuccess";

export default (env) => new Response(null, {
	status: 204,
	headers: emptySuccess(env)
})
