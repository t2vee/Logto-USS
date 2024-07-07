// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import fetchAccessToken from "../api/utils/fetchAccessToken";
import verifyAuthToken from "../api/utils/verifyAuthToken";
import { createDataValidator } from '../api/libs/DataValidator'
import { createHttpClient } from '../api/libs/HttpClient'


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
            ctx.accesstoken = accessTokenResponse.access_token;
        } catch (err) {
            console.log('Failed to fetch AccessToken', err);
            ctx.accesstoken = null;
        }
    } else {
        ctx.accesstoken = accessToken;
    }
    console.log('[MIDDLEWARE] Request Tokens Setup Complete')
}

const authenticationCheck = async (ctx) => {
    try {
        const tokenInfo = await verifyAuthToken(ctx.request, ctx.env);
        ctx.userid = tokenInfo.sub;
        console.log('[MIDDLEWARE] Bearer Token Check Succeeded')
    } catch (e) {
        console.log('[MIDDLEWARE] Bearer Token Check FAILED')
        return new Response('ERR_FAILED_TO_VERIFY_TOKEN', { status: e.statusCode });
    }
}

const validateVerificationCode = async (ctx) => {
    const url = new URL(ctx.request.url);
    const verificationCode = url.searchParams.get('verification-code');
    const verificationCodePattern = /^\d{6}$/;
    if (verificationCode) {
        if (!verificationCodePattern.test(verificationCode)) {
            return new Response('ERR_CODE_INVALID', { status: 400 });
        }
        console.log('[MIDDLEWARE] Verification Code Check Succeeded')
        ctx.verificationCode = verificationCode;
    }
}

const initialiseRequestLibs = async (ctx) => {
    try {
        ctx.Validate = createDataValidator(ctx.env)
        ctx.Http = createHttpClient(ctx.env, ctx.accesstoken)
    } catch (e) {
        console.error('[MIDDLEWARE] FAILED to Initialise Request Context');
    }
    console.log('[MIDDLEWARE] Request Context Initialised');
}


export const onRequest = [
    //errorHandling,
    initialiseApiAccessToken,
    authenticationCheck,
    validateVerificationCode,
    initialiseRequestLibs
];