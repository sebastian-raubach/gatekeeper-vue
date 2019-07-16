<template>
  <div id="app">
    <b-container fluid>
      <b-row>
        <div class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
          <div class="sidebar-sticky">
            <template v-if="token && token.fullName">
              <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">{{ token.fullName }}</h6>
              <ul class="nav flex-column">
                <b-nav-item to="/"><SettingsIcon class="mr-2" /><span>{{ $t('menuUserSettings') }}</span></b-nav-item>
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
        </div>

        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <div class="justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3">
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
import SettingsIcon from 'vue-material-design-icons/Settings'
import { mapState } from 'vuex'
import { EventBus } from '../event-bus.js'

export default {
  name: 'app',
  data: function () {
    return {
      stats: null
    }
  },
  components: {
    AccountGroupIcon,
    AccountQuestionIcon,
    DatabaseIcon,
    SettingsIcon
  },
  computed: {
    ...mapState([
      'token'
    ])
  },
  methods: {
    getStats: function () {
      var vm = this
      this.apiGetStatCounts(function (result) {
        vm.stats = result
      }, {
        codes: [],
        callback: function () {
          vm.stats = null
        }
      })
    }
  },
  mounted: function () {
    var vm = this

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
