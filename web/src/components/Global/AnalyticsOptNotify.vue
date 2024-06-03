<script setup>
import { onMounted, ref } from 'vue'
import { Cookie, Loader } from 'lucide-vue-next'
import {
  ToastAction,
  ToastDescription,
  ToastProvider,
  Toast as ToastRoot,
  ToastTitle,
  ToastViewport
} from '@/components/ui/Custom/toast/index.js'
import httpJsonp from 'http-jsonp'

const open = ref(false)
const ajaxUrl = `${import.meta.env.VITE_MATOMO_ENDPOINT}/index.php?module=API&method=AjaxOptOut.`
const optedIn = ref(null)
const loading = ref(false)

const doIgnore = () => {
  loading.value = true
  const url = `${ajaxUrl}doIgnore`
  const script = document.createElement('script')
  script.src = `${url}`
  document.body.appendChild(script)
}

const doTrack = () => {
  loading.value = true
  const url = `${ajaxUrl}doTrack`
  const script = document.createElement('script')
  script.src = `${url}`
  document.body.appendChild(script)
}

// From https://github.com/inventage/matomo-opt-out/blob/569557bcec321060ea601149acf60889ec1d466f/src/MatomoOptOut.js#L122
function _fetchTrackedState() {
  httpJsonp({
    url: `${ajaxUrl}isTracked`,
    callbackProp: 'callback',
    callback: (data) => {
      const { value } = data
      if (value !== undefined) {
        optedIn.value = value
      }
    },
    error: (e) => {
      console.log('An error occurred when accessing `isTracked` API method.', e)
    },
    complete: () => {
      loading.value = false
    }
  })
}

const cookieFlow = () => {
  open.value = true
  _fetchTrackedState()
  console.log(optedIn.value)
}

//onMounted(cookieFlow)
</script>

<template>
  <ToastProvider :duration="999999">
    <ToastRoot v-model:open="open">
      <div class="space-y-3">
        <div class="flex flex-col items-center align-middle justify-center">
          <ToastTitle class="flex gap-x-2">
            <Cookie :size="42" /> We use cookies to help improve the site
          </ToastTitle>
          <ToastDescription as-child>
            <p>
              You can opt out at any time. Learn more at
              <br />
              <span>
                <a
                  class="underline hover:no-underline"
                  target="_blank"
                  href="https://www.cookiesandyou.com"
                >
                  Cookies And You
                </a>
              </span>
              and our
              <span>
                <a class="underline hover:no-underline" href="/legal/privacypolicy">
                  Privacy Policy
                </a>
              </span>
              <br />
              <span class="flex items-center align-middle justify-center"
                >You are currently&nbsp;<span v-if="loading"
                  ><Loader class="animate-spin" :size="16" /></span
                ><span class="font-bold" v-else>{{ optedIn ? optedIn : 'Opted Out' }}</span></span
              >
            </p>
          </ToastDescription>
        </div>
        <div class="flex flex-col space-y-2">
          <ToastAction as-child alt-text="Goto schedule to undo">
            <!--suppress HtmlUnknownAttribute -->
            <button class="hover:text-black" :onclick="doTrack">Accept</button>
          </ToastAction>
          <ToastAction as-child alt-text="Goto schedule to undo">
            <!--suppress HtmlUnknownAttribute -->
            <button class="hover:text-black" :onclick="doIgnore">Opt Out</button>
          </ToastAction>
        </div>
      </div>
    </ToastRoot>
    <ToastViewport />
  </ToastProvider>
</template>
