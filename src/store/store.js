import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

var name = process.env.VUE_APP_INSTANCE_NAME

if (!name) {
  name = 'gatekeeper-' + window.location.pathname
}

const store = new Vuex.Store({
  state: {
    token: null,
    locale: null,
    baseUrl: null
  },
  getters: {
    token: state => state.token,
    locale: state => state.locale,
    baseUrl: state => state.baseUrl
  },
  mutations: {
    ON_TOKEN_CHANGED_MUTATION: function (state, newToken) {
      state.token = newToken
    },
    ON_LOCALE_CHANGED_MUTATION: function (state, newLocale) {
      state.locale = newLocale
    },
    ON_BASE_URL_CHANGED_MUTATION: function (state, newBaseUrl) {
      state.baseUrl = newBaseUrl
    },
    ON_EMAIL_CHANGED_MUTATION: function (state, newEmail) {
      state.token.email = newEmail
    }
  },
  actions: {
    ON_TOKEN_CHANGED: function ({ commit }, token) {
      commit('ON_TOKEN_CHANGED_MUTATION', token)
    },
    ON_LOCALE_CHANGED: function ({ commit }, locale) {
      commit('ON_LOCALE_CHANGED_MUTATION', locale)
    },
    ON_BASE_URL_CHANGED: function ({ commit }, baseUrl) {
      commit('ON_BASE_URL_CHANGED_MUTATION', baseUrl)
    },
    ON_EMAIL_CHANGED: function ({ commit }, email) {
      commit('ON_EMAIL_CHANGED_MUTATION', email)
    }
  },
  plugins: [
    createPersistedState({
      key: name
    })
  ]
})

export default store
