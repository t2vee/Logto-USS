// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { API } from './index.js';

export default {
    install(app, options) {
        const api = new API(options);
        app.provide('api', api);
    }
};
