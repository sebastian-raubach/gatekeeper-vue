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

Vue.use(FlagIcon)

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

Vue.use(ClientTable, tableOptions, false, 'bootstrap4', 'default')
Vue.use(ServerTable, tableOptions, false, 'bootstrap4', 'default')

Vue.mixin(mixin)
Vue.mixin(api)

// Set base URL based on environment
var baseUrl = 'http://localhost:8080/gatekeeper-api/v1/'

router.options.routes.forEach(function (r) {
  if (!r.props) {
    r.props = {}
  }
  r.props.baseUrl = baseUrl

  if (r.children) {
    r.children.forEach(function (c) {
      if (!c.props) {
        c.props = {}
      }
      c.props.baseUrl = baseUrl
    })
  }
})

store.commit('ON_BASE_URL_CHANGED_MUTATION', baseUrl)

// Make sure jQuery is available
Vue.use({
  install: function (Vue) {
    Vue.prototype.$jQuery = require('jquery')
    window.jQuery = Vue.prototype.$jQuery
    Vue.prototype.$zxcvbn = require('zxcvbn')
    window.zxcvbn = Vue.prototype.$zxcvbn
    Vue.prototype.$axios = require('axios')
    window.axios = Vue.prototype.$axios
    Vue.prototype.$moment = require('moment')
    window.moment = Vue.prototype.$moment
  }
})

Vue.use(BootstrapVue)

Vue.config.productionTip = false

Vue.filter('toDate', function (value) {
  return window.moment(value).format(window.moment.localeData().longDateFormat('L'))
})

new Vue({
  router: router,
  store: store,
  i18n: i18n,
  render: h => h(App, {
    props: {
      baseUrl: baseUrl
    }
  })
}).$mount('#app')
