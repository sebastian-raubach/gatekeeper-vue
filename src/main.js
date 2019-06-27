import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import BootstrapVue from 'bootstrap-vue'
import '@/assets/css/custom.scss'
import mixin from './mixins/mixin.js'
import api from './mixins/api.js'
import { ClientTable, ServerTable } from 'vue-tables-2'

Vue.use(ClientTable, {}, false, 'bootstrap4', 'default')
Vue.use(ServerTable, {}, false, 'bootstrap4', 'default')

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
    window.axios = require('axios')
  }
})

Vue.use(BootstrapVue)

Vue.config.productionTip = false

new Vue({
  router: router,
  store: store,
  render: h => h(App, {
    props: {
      baseUrl: baseUrl
    }
  })
}).$mount('#app')
