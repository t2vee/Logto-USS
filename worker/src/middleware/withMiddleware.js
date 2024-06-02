// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


const withMiddleware = (middleware) => {
	return (request, env, ctx) => middleware(request, env, ctx);
};

export default withMiddleware
