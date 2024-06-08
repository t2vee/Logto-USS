// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import {HttpClient} from "@/lib/api/HttpClient.js";

export class API extends HttpClient {
    constructor (options) {
        super(options);
    }
    async UserData(UseLogto, StateHandler, logtoRepsonse) {
        try {
            const res = await this.get('/api/v2/me/extended-user-info', UseLogto, {})
            StateHandler.onSuccess(res.status)
            return Object.assign(res.data, logtoRepsonse)
        } catch (e) {
            console.log(e)
            StateHandler.onError(e.statusCode)
        } finally {
            StateHandler.runAlways()
        }
    }
    async MfaOptions(UseLogto, StateHandler) {
        try {
            const r = await this.get('/api/v2/me/mfa/methods', UseLogto, {})
            StateHandler.onSuccess(r.status)
            return r.data
        } catch (e) {
            console.log(e)
            StateHandler.onError(e.statusCode)
        } finally {
            StateHandler.runAlways()
        }
    }
    async IsMfaRequired(UseLogto, StateHandler) {
        try {
            const r = await this.get('/api/v2/me/is-mfa-required', UseLogto, {})
            StateHandler.onSuccess(r.status)
            return r.data
        } catch (e) {
            console.log(e)
            StateHandler.onError(e.statusCode)
        } finally {
            StateHandler.runAlways()
        }
    }
    async UpdateBaseUserData(UseLogto, StateHandler, endpoint, body){
        try {
            const r = await this.post(endpoint, UseLogto, {
                data: body
            })
            StateHandler.onSuccess(r.status)
            return r
        } catch (e) {
            console.log(e)
            StateHandler.onError(e.statusCode)
        } finally {
            StateHandler.runAlways()
        }
    }
    async SendVerificationCode(UseLogto, StateHandler, type){
        try {
            const r = await this.post(`/api/v2/me/mfa-flow/push-${type}`, UseLogto, {})
            StateHandler.onSuccess(r.status)
            return r
        } catch (e) {
            console.log(e)
            StateHandler.onError(e.statusCode)
        } finally {
            StateHandler.runAlways()
        }
    }
    async VerifyCode(UseLogto, StateHandler, type, code){
        try {
            const r = await this.post(`/api/v2/me/mfa-flow/verify-${type}-code?verification-code=${code}`, UseLogto, {})
            StateHandler.onSuccess(r.status)
            return r
        } catch (e) {
            console.log(e)
            StateHandler.onError(e.statusCode)
        } finally {
            StateHandler.runAlways()
        }
    }
}