import './assets/main.css'
import './assets/base.css'
import './assets/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createLogto, UserScope  } from '@logto/vue';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

import App from './App.vue'
import router from './router'
const app = createApp(App)
const config = {
    endpoint: import.meta.env.VITE_LOGTO_ENDPOINT,
    appId: import.meta.env.VITE_LOGTO_APPID,
    scopes: [UserScope.Profile, UserScope.Email, UserScope.Phone, UserScope.CustomData, UserScope.Identities, UserScope.Organizations],
    resources: JSON.parse(import.meta.env.VITE_LOGTO_RESOURCES),
};

app.use(createPinia())
app.use(router)
app.use(autoAnimatePlugin)
app.use(createLogto, config);

app.mount('#app')
