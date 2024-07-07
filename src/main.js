import './assets/main.css'
import './assets/index.css'

import { createApp } from 'vue'
import VueMatomo from 'vue-matomo'
import { createLogto, UserScope } from '@logto/vue'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const logtoConfig = {
  endpoint: import.meta.env.VITE_LOGTO_ENDPOINT,
  appId: import.meta.env.VITE_LOGTO_APPID,
  scopes: [
    UserScope.Profile,
    UserScope.Email,
    UserScope.Phone,
    UserScope.Identities,
    UserScope.Organizations,
    UserScope.CustomData
  ],
  resources: JSON.parse(import.meta.env.VITE_LOGTO_CORE_RESOURCE)
}

app.use(router)
app.use(autoAnimatePlugin)
app.use(createLogto, logtoConfig)
if (import.meta.env.VITE_MATOMO_ENDPOINT) {
  app.use(VueMatomo, {
    host: import.meta.env.VITE_MATOMO_ENDPOINT,
    siteId: import.meta.env.VITE_MATOMO_SITE_ID,
    trackerFileName: 'matomo',
    router: router,
    enableLinkTracking: true
  })
}

app.mount('#app')

if (import.meta.env.VITE_MATOMO_ENDPOINT) {
  window._paq.push(['trackPageView'])
}
