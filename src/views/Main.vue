<template>
  <div id="app">
    <b-navbar type="dark" variant="dark" fixed="top" class="flex-md-nowrap p-0 shadow">
      <b-navbar-brand class="col-md-3 col-lg-2 mr-0" to="/">
        <b-img src="/gatekeeper-dark.svg" height=35 />
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto mr-2">
        <b-nav-item-dropdown text="Lang" right>
          <template slot="button-content"><TranslateIcon class="form-icon" /></template>
          <b-dropdown-item v-for="language in languages" :key="language.locale" @click="onLocaleChanged(language)"><flag :squared="false" :iso="language.flag" class="flag-icon" /> {{ language.name }}</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item to="/" @click="signOut" :title="$t('navbarActionSignOut')">
          <LogoutVariantIcon class="form-icon" :title="$t('navbarActionSignOut')" />
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <b-container fluid>
      <b-row>
        <b-nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
          <div class="sidebar-sticky">
            <template v-if="token && token.fullName">
              <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">{{ token.fullName }}</h6>
              <ul class="nav flex-column">
                <b-nav-item to="/settings"><SettingsIcon class="mr-2" /><span>{{ $t('menuUserSettings') }}</span></b-nav-item>
              </ul>
            </template>
            <template v-if="stats">
              <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">{{ $t('menuUsers') }}</h6>
              <ul class="nav flex-column">
                <b-nav-item to="/users"><AccountGroupIcon class="mr-2" />{{ $t('menuUsersActive') }} <b-badge pill v-if="stats.users" class="mt-1 float-right">{{ stats.users }}</b-badge></b-nav-item>
                <b-nav-item to="/requests"><AccountQuestionIcon class="mr-2" />{{ $t('menuUserRequests') }} <b-badge pill v-if="stats.requests" class="mt-1 float-right">{{ stats.requests }}</b-badge></b-nav-item>
              </ul>
              <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">{{ $t('menuDatabases') }}</h6>
              <ul class="nav flex-column">
                <b-nav-item to="/databases"><DatabaseIcon class="mr-2" />{{ $t('menuDatabasesDatabases') }} <b-badge pill v-if="stats.databases" class="mt-1 float-right">{{ stats.databases }}</b-badge></b-nav-item>
              </ul>
            </template>
          </div>
        </b-nav>

        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
            <router-view :key="$route.path" />
          </div>
        </main>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import AccountGroupIcon from 'vue-material-design-icons/AccountGroup'
import AccountQuestionIcon from 'vue-material-design-icons/AccountQuestion'
import DatabaseIcon from 'vue-material-design-icons/Database'
import LogoutVariantIcon from 'vue-material-design-icons/LogoutVariant'
import SettingsIcon from 'vue-material-design-icons/Settings'
import TranslateIcon from 'vue-material-design-icons/Translate'
import { mapState } from 'vuex'
import { EventBus } from '../event-bus.js'

export default {
  name: 'app',
  data: function () {
    return {
      stats: null,
      languages: [{
        locale: 'en_GB',
        flag: 'gb',
        name: 'British English'
      }, {
        locale: 'de_DE',
        flag: 'de',
        name: 'Deutsch - Deutschland'
      }]
    }
  },
  components: {
    AccountGroupIcon,
    AccountQuestionIcon,
    DatabaseIcon,
    LogoutVariantIcon,
    SettingsIcon,
    TranslateIcon
  },
  props: [ 'baseUrl' ],
  computed: {
    ...mapState([
      'token',
      'locale'
    ])
  },
  methods: {
    onLocaleChanged: function (language) {
      this.$i18n.locale = language.locale
      this.$store.dispatch('ON_LOCALE_CHANGED', language.locale)
    },
    signOut: function () {
      var vm = this

      var user = {
        email: this.token.username,
        password: this.token.token
      }

      this.apiDeleteToken(user, function (result) {
        console.log(result)
        // If it's successful, delete token, then redirect
        vm.$store.dispatch('ON_TOKEN_CHANGED', null)
        vm.$router.push('/login')
      }, function () {
        // If they're wrong, remove
        vm.$store.dispatch('ON_TOKEN_CHANGED', null)
      })
    },
    getStats: function () {
      var vm = this
      this.apiGetStatCounts(function (result) {
        vm.stats = result
      }, function (err) {
        console.error(err)
        vm.stats = null
      })
    }
  },
  mounted: function () {
    var vm = this

    if (this.locale) {
      this.$i18n.locale = this.languages.map(function (l) {
        return l.locale
      }).filter(function (l) {
        return vm.locale === l
      })
    }

    this.getStats()

    EventBus.$on('stats-count-changed', function (count) {
      vm.getStats()
    })
  }
}
</script>

<style>
  .sidebar .nav-link > span:nth-child(2) {
    vertical-align: middle;
  }
</style>
