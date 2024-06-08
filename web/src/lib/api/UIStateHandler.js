// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

export class UIStateHandler {
    constructor(config) {
        this.always = config.always;
        this.error = config.error;
        this.success = config.success;
    }

    handleRefs(refs) {
        console.log('[STATEHANDLER] Running Ref Flips')
        if (refs) {
            for (const key in refs) {
                console.log('[STATEHANDLER] Current ref:' + key)
                if (refs[key] && refs[key].value !== undefined) {
                    refs[key].value = !refs[key].value;
                }
            }
        }
    }

    handleSetValue(setValue) {
        console.log('[STATEHANDLER] Running SetValue')
        if (setValue) {
            for (const key in setValue) {
                console.log('[STATEHANDLER] Current value:' + key)
                if (setValue[key] && setValue[key].target && setValue[key].target.value !== undefined) {
                    setValue[key].target.value = setValue[key].value;
                }
            }
        }
    }

    handleEvents(events) {
        console.log('[STATEHANDLER] Running Events')
        if (events) {
            for (const event in events) {
                console.log('[STATEHANDLER] Current event:' + event)
                events[event]();
            }
        }
    }

    onSuccess(statusCode = null) {
        console.log('[STATEHANDLER] Event success');
        console.log('[STATEHANDLER] Request status code:' + statusCode);
        console.log('[STATEHANDLER] Success Config:' + this?.success)
        if (statusCode && this.success && this.success[`on${statusCode}`]) {
            const config = this.success[`on${statusCode}`];
            this.handleRefs(config.refs);
            this.handleEvents(config.events);
            this.handleSetValue(config.setValue);
        } else if (this.success && this.success.onDefault) {
            this.handleRefs(this.success.onDefault.refs);
            this.handleEvents(this.success.onDefault.events);
            this.handleSetValue(this.success.onDefault.setValue);
        }

        if (this.success && this.success.events) {
            this.handleEvents(this.success.events);
        }
        if (this.success && this.success.refs) {
            this.handleRefs(this.success.refs);
        }
    }

    runAlways() {
        console.log('[STATEHANDLER] Event Pass');
        console.log('[STATEHANDLER] Always Config:' + this?.always)
        if (this.always) {
            this.handleRefs(this.always.refs);
            this.handleEvents(this.always.events);
            this.handleSetValue(this.always.setValue);
        }
    }

    onError(statusCode = null) {
        console.log('[STATEHANDLER] Event FAIL');
        console.log('[STATEHANDLER] Request status code:' + statusCode);
        console.log('[STATEHANDLER] Failure Config:' + this?.error)

        if (statusCode && this.error && this.error[`on${statusCode}`]) {
            const config = this.error[`on${statusCode}`];
            this.handleRefs(config.refs);
            this.handleEvents(config.events);
            this.handleSetValue(config.setValue);
        } else if (this.error && this.error.onDefault) {
            this.handleRefs(this.error.onDefault.refs);
            this.handleEvents(this.error.onDefault.events);
            this.handleSetValue(this.error.onDefault.setValue);
        }

        if (this.error && this.error.events) {
            this.handleEvents(this.error.events);
        }
        if (this.error && this.error.refs) {
            this.handleRefs(this.error.refs);
        }
    }
}

