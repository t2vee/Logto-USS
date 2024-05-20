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
    UserScope.Organizations
  ],
  resources: JSON.parse(import.meta.env.VITE_LOGTO_RESOURCES)
}

app.use(router)
app.use(autoAnimatePlugin)
app.use(createLogto, logtoConfig)
app.use(VueMatomo, {
  host: import.meta.env.VITE_MATOMO_ENDPOINT,
  siteId: 2,
  trackerFileName: 'matomo',
  router: router,
  enableLinkTracking: true
})

app.mount('#app')

window._paq.push(['trackPageView'])
