// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license. 


export default () => new Response(JSON.stringify({ status: 'failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
