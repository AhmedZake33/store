import Vue from 'vue'
import { ToastPlugin, ModalPlugin, TooltipPlugin, VBTooltip, ButtonPlugin } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'
import yearPicker from 'vue-year-picker'
import i18n from '@/libs/i18n'
import router from './router'
import store from './store'
import App from './App.vue'
export const EventBus = new Vue();
import VueCookie from 'vue-js-cookie'
import Unicon from 'vue-unicons/dist/vue-unicons-vue2.umd'
import { uniLayerGroupMonochrome, uniCarWash,uniFileExport } from 'vue-unicons/dist/icons'
Unicon.add([uniLayerGroupMonochrome, uniCarWash,uniFileExport])
Vue.use(Unicon)


import moment from 'moment'
// Pass options to make all validators use the arabic language, also merge the english and arabic attributes with the internal dictionary.

Vue.use(VueCookie)
//  vue-excel-editor
import VueExcelEditor from './views/components/common/vue-excel-editor/src/main'
Vue.use(VueExcelEditor)

Vue.use(yearPicker)

import VueLazyload from 'vue-lazyload'
// Vue.use(VueLazyload)

// or with options
const loadimage = require('./assets/images/loading4.gif')
// errorimage = require('./assets/images/loading1.gif')

Vue.use(VueLazyload, {
    preLoad: 1.3,
    //error: errorimage,
    loading: loadimage,
    attempt: 1,
})

// Vue.directive('click-outside', {
//     bind: function (el, binding, vnode) {
//       this.event = function (event) {
//         if (!(el == event.target || el.contains(event.target))) {
//           vnode.context[binding.expression](event);
//         }
//       };
//       document.body.addEventListener('click', this.event)
//     },
//     unbind: function (el) {
//       document.body.removeEventListener('click', this.event)
//     },
//   });
//vuex
import Vuex from 'vuex'
Vue.use(Vuex)

// Global Components
import './global-components'

// 3rd party plugins
import '@axios'
import '@/libs/acl'
import '@/libs/portal-vue'
import '@/libs/clipboard'
import '@/libs/toastification'
import '@/libs/sweet-alerts'
import '@/libs/vue-select'
import '@/libs/tour'

import '@/mixins/mixins'



// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)
Vue.use(TooltipPlugin)
Vue.use(ButtonPlugin)
Vue.directive('b-tooltip', VBTooltip)
    // Composition API
Vue.use(VueCompositionAPI)

Vue.prototype.moment = moment

// Feather font icon - For form-wizard
// * Shall remove it if not using font-icons of feather-icons - For form-wizard
require('@core/assets/fonts/feather/iconfont.css') // For form-wizard

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
}).$mount('#app')
