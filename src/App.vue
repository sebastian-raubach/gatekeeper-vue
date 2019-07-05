<template>
  <div>
    <b-navbar type="dark" variant="dark" fixed="top" class="flex-md-nowrap p-0 shadow">
      <b-navbar-brand class="col-md-3 col-lg-2 mr-0" to="/">
        <b-img src="/gatekeeper-dark.svg" height=35 />
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto mr-2">
        <b-nav-item :to="token ? '/about' : '/gk/about'">About</b-nav-item>
        <b-nav-item-dropdown text="Lang" right>
          <template slot="button-content"><TranslateIcon class="form-icon" /></template>
          <b-dropdown-item v-for="language in languages" :key="language.locale" @click="onLocaleChanged(language)"><flag :squared="false" :iso="language.flag" class="flag-icon" /> {{ language.name }}</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item to="/" @click="signOut" :title="$t('navbarActionSignOut')" v-if="token">
          <LogoutVariantIcon class="form-icon" :title="$t('navbarActionSignOut')" />
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>

    <router-view />

    <footer id="sticky-footer" class="py-2 px-3 bg-dark text-white-50">
      <div class="text-right">
        <small><a href="#" @click="$event.preventDefault()" v-b-modal.cookie-policy>{{ $t('widgetFooterCookiePolicy') }}</a></small> | <small v-html="$t('widgetFooterText', { year: new Date().getFullYear(), version: $t('appVersion') })"></small>
      </div>
    </footer>
    <b-modal id="cookie-policy" :title="$t('modalCookiePolicyTitle')">
      <div v-html="$t('modalCookiePolicyMessage')"></div>
      <template slot="modal-footer" slot-scope="{ ok }">
        <b-button @click="ok()">
          {{ $t('genericOk') }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import LogoutVariantIcon from 'vue-material-design-icons/LogoutVariant'
import TranslateIcon from 'vue-material-design-icons/Translate'
import { mapState } from 'vuex'

export default {
  name: 'app',
  data: function () {
    return {
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
  computed: {
    ...mapState([
      'token',
      'locale'
    ])
  },
  components: {
    LogoutVariantIcon,
    TranslateIcon
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
        vm.$router.push('/gk/login')
      }, function () {
        // If they're wrong, remove
        vm.$store.dispatch('ON_TOKEN_CHANGED', null)
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
  }
}
</script>

<style>
#app {
  flex: 1 0 auto;
  min-height: calc(100vh - 37px);
}

#sticky-footer {
  flex-shrink: 0;
}
</style>
