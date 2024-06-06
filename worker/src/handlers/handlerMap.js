// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

export const handlerMap = {
	handleSpotifyUserInfoEndpoint: "./handlers/handleSpotifyUserInfoEndpoint",
	user: {
		usernameExists: "./handlers/user/usernameExists",
		extendedUserData: "./handlers/user/extendedUserData",
		canChangeUsername: "./handlers/user/canChangeUsername",
		isMfaRequired: "./handlers/user/isMfaRequired",
		mfa: {
			mfaMethods: "./handlers/user/mfa/methods/mfaMethods",
			createNewMfaMethod: "./handlers/user/mfa/methods/createNewMfaMethod",
			removeMfaMethod: "./handlers/user/mfa/methods/removeMfaMethod",
			removeSMS: "./handlers/user/mfa/new/remove-number",
			flow: {
				pushEmail: "./handlers/user/mfa/flow/push-email",
				verifyEmail: "./handlers/user/mfa/flow/verify-email",
				pushSMS: "./handlers/user/mfa/flow/push-sms",
				verifySMS: "./handlers/user/mfa/flow/verify-sms",
			},
			new: {
				pushNewEmail: "./handlers/user/mfa/new/push-email",
				verifyNewEmail: "./handlers/user/mfa/new/verify-email",
				pushNewSMS: "./handlers/user/mfa/new/push-sms",
				verifyNewSMS: "./handlers/user/mfa/new/verify-sms",
			}
		},
		update: {
			updateFullName: "./handlers/user/update/updateFullName",
			updateUsername: "./handlers/user/update/updateUsername",
			updateLocale: "./handlers/user/update/updateLocale",
			updateBirthday: "./handlers/user/update/updateBirthday",
			updateRegionalSettings: "./handlers/user/update/updateRegionalSettings",
			updatePassword: "./handlers/user/update/updatePassword",

		},
		avatar: {
			uploadNewAvatar: "./handlers/user/avatar/uploadNewAvatar",
			removeAvatar: "./handlers/user/avatar/removeAvatar",
		},
		connectors: {
			buildConnectorAuthUri: "./handlers/user/connectors/buildConnectorAuthUri",
			linkConnector: "./handlers/user/connectors/linkConnector",
			removeConnector: "./handlers/user/connectors/removeConnector",
		},
		danger: {
			suspendUser: "./handlers/user/danger/suspendUser",
			terminateUser: "./handlers/user/danger/suspendUser",
		}
	}
};
