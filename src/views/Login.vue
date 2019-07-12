<template>
  <div>
    <main class="container container-fluid">
      <b-form class="form-signin" @submit.prevent="checkCreds">
        <b-img src="/gatekeeper.svg" fluid class="mb-3 mt-5" />
        <h1 class="h3 mb-3 font-weight-normal">{{ $t('pageLoginHeading') }}</h1>
        <label for="inputUsername" class="sr-only">{{ $t('formLabelUsername') }}</label>
        <input id="inputUsername" class="form-control" :placeholder="$t('formLabelUsername')" required autofocus v-model="user.username">
        <label for="inputPassword" class="sr-only">{{ $t('formLabelUsername') }}</label>
        <input type="password" id="inputPassword" class="form-control" :placeholder="$t('formLabelPassword')" required v-model="user.password">
        <b-button variant="link" class="forgot-password" v-b-modal.modal-password>{{ $t('pageLoginForgotPassword') }}</b-button>
        <b-button size="lg" variant="primary" block type="submit">{{ $t('pageLoginSignIn') }}</b-button>

        <div v-if=response class="text-red"><p class="vertical-5p lead">{{ response }}</p></div>
      </b-form>
    </main>

    <b-modal id="modal-password"
             :title="$t('modalHeadingResetPassword')"
             :ok-title="$t('genericSend')"
             :ok-disabled="resetInProgress"
             :cancel-title="$t('genericCancel')"
             :cancel-disabled="resetInProgress"
             ref="resetModal"
             @ok="handleOk">
      <b-form ref="resetForm" :class="formValidated ? 'was-validated' : 'needs-validation'" @submit.stop.prevent="onPasswordReset">
        <b-form-group :label="$t('formLabelUsername')" label-for="inputUsername" :invalid-feedback="$t('formFeedbackUsernameRequired')">
          <b-form-input id="inputUsername" name="username" :placeholder="$t('formLabelUsername')" required autofocus v-model="reset.username" />
        </b-form-group>
        <b-form-group :label="$t('formLabelEmail')" label-for="inputEmail" :invalid-feedback="$t('formFeedbackEmailRequired')">
          <b-form-input id="inputEmail" name="email" :placeholder="$t('formLabelEmail')" type="email" required v-model="reset.email" :state="formError ? 'invalid' : null"/>
        </b-form-group>
        <p class="text-danger" v-if="formError">{{ formError }} </p>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
export default {
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
      formError: null,
      error: false,
      resetInProgress: false,
      section: 'Login',
      response: ''
    }
  },
  methods: {
    checkFormValidity: function () {
      this.formValidated = true
      return this.$refs.resetForm.checkValidity()
    },
    onPasswordReset: function () {
      var vm = this

      if (this.checkFormValidity()) {
        this.formError = null

        this.resetInProgress = true
        this.apiPostPasswordReset(this.reset, function (result) {
          if (result === true) {
            vm.$bvToast.toast(vm.$t('toastPasswordResetSuccessful'), {
              title: vm.$t('genericSuccess'),
              variant: 'success',
              autoHideDelay: 5000,
              appendToast: true
            })
          } else {
            vm.$bvToast.toast(vm.$t('errorMessageUnknownServerError'), {
              title: vm.$t('genericError'),
              variant: 'danger',
              autoHideDelay: 5000,
              appendToast: true
            })
          }
          vm.$refs.resetModal.hide()
          vm.resetInProgress = false
        }, {
          codes: [],
          callback: function (err) {
            vm.formValidated = false
            if (err) {
              if (err.status === 400) {
                vm.formError = vm.$t('errorMessageInvalidEmailUsername')
              } else if (err.status === 503) {
                vm.formError = vm.$t('errorMessageEmailUnavailable')
              } else {
                vm.formError = vm.$t('errorMessageUnknownServerError')
              }
            }
          }
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
        vm.$router.push('/')
      }, {
        codes: [],
        callback: function (error) {
          vm.error = true
          if (error.status === 403 || error.status === 400) {
            vm.response = vm.$t('errorMessageInvalidUsernamePassword')
          } else {
            vm.response = vm.$t('errorMessageServerUnavailable')
          }
          // If they're wrong, remove
          vm.$store.dispatch('ON_TOKEN_CHANGED', null)
        }
      })
    },
    resetResponse () {
      this.response = ''
    }
  }
}
</script>

<style>

</style>
