<template>
  <div>
    <b-navbar type="dark" variant="dark" fixed="top" class="flex-md-nowrap p-0 shadow">
      <b-navbar-brand class="col-md-3 col-lg-2 mr-0" to="/">
        <b-img src="/gatekeeper-dark.svg" height=35 />
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto mr-2">
        <b-nav-item-dropdown text="Lang" right>
          <template slot="button-content"><TranslateIcon class="form-icon" /></template>
          <b-dropdown-item v-for="language in languages" :key="language.locale" @click="onLocaleChanged(language)"><flag :squared="false" :iso="language.flag" class="flag-icon" /> {{ language.name }}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
    <main role="main" class="container container-fluid ml-sm-auto px-4">
      <b-form class="form-signin" @submit.prevent="checkCreds">
        <b-img src="/gatekeeper.svg" fluid class="mb-3 mt-5" />
        <h1 class="h3 mb-3 font-weight-normal">{{ $t('pageLoginHeading') }}</h1>
        <label for="inputUsername" class="sr-only">{{ $t('formLabelUsername') }}</label>
        <input id="inputUsername" class="form-control" :placeholder="$t('formLabelUsername')" required autofocus v-model="user.username">
        <label for="inputPassword" class="sr-only">{{ $t('formLabelUsername') }}</label>
        <input type="password" id="inputPassword" class="form-control" :placeholder="$t('formLabelPassword')" required v-model="user.password">
        <b-button variant="link" class="forgot-password" v-b-modal.modal-password>{{ $t('pageLoginForgotPassword') }}</b-button>
        <b-button size="lg" variant="primary" block type="submit">{{ $t('pageLoginSignIn') }}</b-button>
      </b-form>

      <!-- errors -->
      <div v-if=response class="text-red"><p class="vertical-5p lead">{{ response }}</p></div>
    </main>

    <b-modal id="modal-password"
             :title="$t('modalHeadingResetPassword')"
             :ok-title="$t('genericSend')"
             :cancel-title="$t('genericCancel')"
             @ok="handleOk">
      <b-form ref="resetForm" :class="formValidated ? 'was-validated' : 'needs-validation'" @submit.stop.prevent="onPasswordReset">
        <b-form-group :label="$t('formLabelUsername')" label-for="inputUsername" :invalid-feedback="$t('formFeedbackUsernameRequired')">
          <b-form-input id="inputUsername" name="username" :placeholder="$t('formLabelUsername')" required autofocus v-model="reset.username" />
        </b-form-group>
        <b-form-group :label="$t('formLabelEmail')" label-for="inputEmail" :invalid-feedback="$t('formFeedbackEmailRequired')">
          <b-form-input id="inputEmail" name="email" :placeholder="$t('formLabelEmail')" type="email" required v-model="reset.email"/>
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TranslateIcon from 'vue-material-design-icons/Translate'

export default {
  props: [ 'baseUrl' ],
  data: function () {
    return {
      user: {
        username: null,
        password: null
      },
      reset: {
        username: null,
        email: null
      },
      formValidated: false,
      error: false,
      section: 'Login',
      response: '',
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
      'locale'
    ])
  },
  components: {
    TranslateIcon
  },
  methods: {
    checkFormValidity: function () {
      this.formValidated = true
      return this.$refs.resetForm.checkValidity()
    },
    onLocaleChanged: function (language) {
      this.$i18n.locale = language.locale
      this.$store.dispatch('ON_LOCALE_CHANGED', language.locale)
    },
    onPasswordReset: function () {
      var vm = this

      if (this.checkFormValidity()) {
        this.apiPostPasswordReset(this.reset, function (result) {
          console.log(result)
          vm.$refs.resetForm.hide()
        }, function (err) {
          console.error(err)
        })
      }
    },
    handleOk (event) {
      event.preventDefault()
      this.onPasswordReset()
    },
    checkCreds: function () {
      var vm = this

      this.resetResponse()

      this.apiPostToken(this.user, function (result) {
        vm.error = false
        // If it's successful, finally store them
        vm.$store.dispatch('ON_TOKEN_CHANGED', result)
        vm.$router.push('/settings')
      }, function (xhr) {
        vm.error = true
        if (xhr.status === 403) {
          vm.response = 'Invalid username or password'
        } else {
          vm.response = 'Server appears to be offline'
        }
        // If they're wrong, remove
        vm.$store.dispatch('ON_TOKEN_CHANGED', null)
      })
    },
    resetResponse () {
      this.response = ''
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

</style>
