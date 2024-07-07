// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import fetchAccessToken from "../../../api/utils/fetchAccessToken.js";
import verifyAuthToken from "../../../api/utils/verifyAuthToken.js";
import { createDataValidator } from '../../../api/libs/DataValidator/index.js'
import { createHttpClient } from '../../../api/libs/HttpClient.js'


/*const errorHandling = async (ctx) => {
    try {
        return await ctx.next();
    } catch (err) {
        return new Response(`${err.message}`, { status: 500 });
    }
}*/

const initialiseApiAccessToken = async (ctx) => {
    let accessToken = await ctx.env.LogtoAccessToken.get("access_token");
    let expiry = await ctx.env.LogtoAccessToken.get("token_expiry");
    const now = Math.floor(Date.now() / 1000);
    if (!accessToken || !expiry || parseInt(expiry) <= now) {
        console.log("[MIDDLEWARE] Access token non-existent or expired. Fetching New Token...");
        try {
            const accessTokenResponse = await fetchAccessToken(ctx.env);
            await ctx.env.LogtoAccessToken.put("access_token", accessTokenResponse.access_token, { expirationTtl: accessTokenResponse.expires_in });
            await ctx.env.LogtoAccessToken.put("token_expiry", (now + accessTokenResponse.expires_in).toString(), { expirationTtl: accessTokenResponse.expires_in });
            ctx.data.accesstoken = accessTokenResponse.access_token;
        } catch (err) {
            console.log('Failed to fetch AccessToken', err);
            ctx.data.accesstoken = null;
            return new Response('INTERNAL_MIDDLEWARE_ERROR', { status: 500 });
        }
    } else {
        ctx.data.accesstoken = accessToken;
    }
    console.log('[MIDDLEWARE] Stage 1 - Request Tokens Setup Complete')
    return await ctx.next()
}

const authenticationCheck = async (ctx) => {
    try {
        const tokenInfo = await verifyAuthToken(ctx.request, ctx.env);
        ctx.userid = tokenInfo.sub;
        console.log('[MIDDLEWARE] Stage 2 - Bearer Token Check Succeeded')
    } catch (e) {
        console.log('[MIDDLEWARE] Bearer Token Check FAILED')
        return new Response('ERR_FAILED_TO_VERIFY_TOKEN', { status: e.statusCode });
    }
    return await ctx.next()
}

const validateVerificationCode = async (ctx) => {
    const url = new URL(ctx.request.url);
    const verificationCode = url.searchParams.get('verification-code');
    const verificationCodePattern = /^\d{6}$/;
    if (verificationCode) {
        if (!verificationCodePattern.test(verificationCode)) {
            return new Response('ERR_CODE_INVALID', { status: 400 });
        }
        ctx.data.verificationCode = verificationCode;
    }
    console.log('[MIDDLEWARE] Stage 3 - Verification Code Check Succeeded')
    return await ctx.next()
}

const initialiseRequestLibs = async (ctx) => {
    try {
        console.log(ctx.data.accesstoken)
        ctx.data.Validate = createDataValidator(ctx.env)
        ctx.data.Http = createHttpClient(ctx.env, ctx.data.accesstoken)
    } catch (e) {
        console.error('[MIDDLEWARE] FAILED to Initialise Request Context');
        return new Response('INTERNAL_MIDDLEWARE_ERROR', { status: 500 });
    }
    console.log('[MIDDLEWARE] Stage 4 - Request Context Initialised');
    return await ctx.next()
}


export const onRequest = [
    //errorHandling,
    initialiseApiAccessToken,
    authenticationCheck,
    validateVerificationCode,
    initialiseRequestLibs
];