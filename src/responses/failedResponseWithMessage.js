// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license. 


export default (error) => Response.json(error, { status: error.status || 400, headers: { 'Content-Type': 'application/json' } })
