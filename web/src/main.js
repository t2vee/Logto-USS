import './assets/main.css'
import './assets/index.css'

import { createApp } from 'vue'
import { createLogto, UserScope } from '@logto/vue'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import VueMatomo from 'vue-matomo'
import CreateAPI from './lib/api/pluginInstall.js'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(autoAnimatePlugin)
app.use(createLogto, {
  endpoint: import.meta.env.VITE_LOGTO_ENDPOINT,
  appId: import.meta.env.VITE_LOGTO_APPID,
  scopes: [
    UserScope.Profile,
    UserScope.Email,
    UserScope.Phone,
    UserScope.Identities,
    UserScope.Organizations
  ],
  resources: JSON.parse(import.meta.env.VITE_LOGTO_RESOURCES)
})
if (import.meta.env.VITE_MATOMO_ENDPOINT) {
  app.use(VueMatomo, {
    host: import.meta.env.VITE_MATOMO_ENDPOINT,
    siteId: 2,
    trackerFileName: 'matomo',
    router: router,
    enableLinkTracking: true
  })
}
app.use(CreateAPI, {
  logto: import.meta.env.VITE_LOGTO_ENDPOINTz,
  coreResource: import.meta.env.VITE_LOGTO_CORE_RESOURCE
});

app.mount('#app')

if (import.meta.env.VITE_MATOMO_ENDPOINT) {
  window._paq.push(['trackPageView'])
}
