// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

export const API = {
    AVATAR: {
        UPLOAD: '/api/v2/me/avatar/upload',
        REMOVE: '/api/v2/me/avatar/remove',
    },
    CONNECTORS: {
        BUILD_URI: (connectorId) => `/api/v2/me/connectors/build-uri/${connectorId}`,
        LINK: (connectorId) => `/api/v2/me/connectors/link/${connectorId}`,
        REMOVE: (connectorId) => `/api/v2/me/connectors/remove/${connectorId}`,
    },
    DANGERZONE: {
        SUSPEND: '/api/v2/me/dangerzone/suspend',
        TERMINATE: '/api/v2/me/dangerzone/terminate',
    },
    EDIT: {
        BIRTHDAY: '/api/v2/me/edit/birthday',
        DEVELOPER: '/api/v2/me/edit/developer',
        FULLNAME: '/api/v2/me/edit/fullname',
        LOCALE: '/api/v2/me/edit/locale',
        PASSWORD: '/api/v2/me/edit/password',
        REGIONAL: '/api/v2/me/edit/regional',
        REMOVE_SMS: '/api/v2/me/edit/remove-sms',
        USERNAME: '/api/v2/me/edit/username',
        VERIFICATION: '/api/v2/me/edit/verification',
    },
    MFA: {
        CREATE: '/api/v2/me/mfa/create',
        METHODS: '/api/v2/me/mfa/methods',
        REMOVE: '/api/v2/me/mfa/remove',
        REQUIRED: '/api/v2/me/mfa/required',
        FLOW: {
            EMAIL: {
                PUSH: '/api/v2/me/mfa/flow/email',
                VERIFY: '/api/v2/me/mfa/flow/email/code',
            },
            SMS: {
                PUSH: '/api/v2/me/mfa/flow/sms',
                VERIFY: '/api/v2/me/mfa/flow/sms/code',
            }
        },
        NEW: {
            EMAIL: {
                PUSH: '/api/v2/me/mfa/new/email',
                VERIFY: '/api/v2/me/mfa/new/email/code',
            },
            SMS: {
                PUSH: '/api/v2/me/mfa/new/sms',
                VERIFY: '/api/v2/me/mfa/new/sms/code',
            }
        }
    },
    ME: {
      INFO: '/api/v2/me/info',
      USERNAME_CHANGE: '/api/v2/me/info/username',
    },
    UTILS: {
        CONNECTOR_CONFIG: '/api/v2/utils/connector-config',
        CHECK_USERNAME_EXISTS: (username) => `/api/v2/utils/check-username-exists/${username}`
    }
};