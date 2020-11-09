import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import BootstrapVue from 'bootstrap-vue'
import '@/assets/css/custom.scss'
import mixin from './mixins/mixin.js'
import api from './mixins/api.js'
import { ClientTable, ServerTable } from 'vue-tables-2'
import { i18n } from './plugins/i18n.js'
import FlagIcon from 'vue-flag-icon'
let axiosDefaults = require('axios/lib/defaults')

var tableOptions = {
  pagination: {
    nav: 'scroll',
    edge: false
  },
  sortIcon: {
    base: 'table-sort',
    up: 'table-sort-up',
    down: 'table-sort-down'
  }
}

Vue.mixin(mixin)
Vue.mixin(api)
Vue.use(ClientTable, tableOptions, false, 'bootstrap4', 'default')
Vue.use(ServerTable, tableOptions, false, 'bootstrap4', 'default')
Vue.use(FlagIcon)
Vue.use(BootstrapVue)
Vue.use({
  install: function (Vue) {
    Vue.prototype.$zxcvbn = require('zxcvbn')
    window.zxcvbn = Vue.prototype.$zxcvbn
    Vue.prototype.$moment = require('moment')
    window.moment = Vue.prototype.$moment
  }
})
Vue.filter('toDate', function (value) {
  return window.moment(value).format(window.moment.localeData().longDateFormat('L'))
})

// Set base URL
var baseUrl = './api/'

if (process.env.VUE_APP_BASE_URL) {
  baseUrl = process.env.VUE_APP_BASE_URL
}

axiosDefaults.baseURL = baseUrl

store.commit('ON_BASE_URL_CHANGED_MUTATION', baseUrl)

Vue.config.productionTip = false

new Vue({
  router: router,
  store: store,
  i18n: i18n,
  render: h => h(App)
}).$mount('#app')
