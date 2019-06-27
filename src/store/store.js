import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: null,
    baseUrl: null
  },
  getters: {
    token: state => state.token,
    baseUrl: state => state.baseUrl
  },
  mutations: {
    ON_TOKEN_CHANGED_MUTATION: function (state, newToken) {
      state.token = newToken
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
    ON_BASE_URL_CHANGED: function ({ commit }, baseUrl) {
      commit('ON_BASE_URL_CHANGED_MUTATION', baseUrl)
    },
    ON_EMAIL_CHANGED: function ({ commit }, email) {
      commit('ON_EMAIL_CHANGED_MUTATION', email)
    }
  },
  plugins: [
    createPersistedState()
  ]
})

export default store
