// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

export class UIStateHandler {
    constructor(config) {
        this.always = config.always;
        this.error = config.error;
        this.success = config.success;
    }
    onSuccess() {
        for (let state in this.success) {
            state = !state;
        }
    }
    runAlways() {
        for (let state in this.always) {
            state = !state;
        }
    }
    onError() {
        for (let state in this.error.refs) {
            state = !state;
        }
        for (const event in this.error.events) {
            this.error.events[event]()
        }
    }
}