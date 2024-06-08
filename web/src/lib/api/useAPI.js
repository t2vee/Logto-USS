// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import { inject } from 'vue';
import { UIStateHandler } from "@/lib/api/UIStateHandler.js";
import { useLogto } from '@logto/vue'

export const useAPI = () => {
    const API = inject('api')
    const { getAccessToken, fetchUserInfo } = useLogto()
    const coreResource = import.meta.env.VITE_LOGTO_CORE_RESOURCE
    return { API, UIStateHandler, getAccessToken, coreResource, fetchUserInfo }
}