<template>
  <b-container fluid>
    <h1>{{ $t('pageSettingsHeading') }}</h1>
    <b-row>
      <b-col xs=12 md=6>
        <b-card header-tag="header" class="mb-3">
          <h6 slot="header" class="mb-0">{{ $t('pageSettingsHeadingUpdateEmail') }}</h6>
          <b-form @submit.prevent="onEmailChanged()">
            <b-form-group>
              <label for="email">{{ $t('formLabelEmail') }}</label>
              <b-input-group>
                <b-input-group-prepend is-text>
                  <AtIcon class="form-icon" />
                </b-input-group-prepend>
                <b-form-input name="email" id="email" type="email" v-model="email" required />
              </b-input-group>
            </b-form-group>
            <b-button variant="primary" type="submit" class="float-right" slot="footer">{{ $t('actionUpdate') }}</b-button>
          </b-form>
        </b-card>
      </b-col>
      <b-col xs=12 md=6>
        <b-card header-tag="header" class="mb-3">
          <h6 slot="header" class="mb-0">{{ $t('pageSettingsHeadingUpdatePassword') }}</h6>

          <b-form @submit.prevent="onPasswordChanged()">
            <b-form-group>
              <label for="old-password">{{ $t('formLabelCurrentPassword') }}</label>
              <b-input-group>
                <b-input-group-prepend is-text>
                  <KeyRemoveIcon class="form-icon" />
                </b-input-group-prepend>
                <b-form-input name="old-password" id="old-password" type="password" v-model="oldPassword" required />
              </b-input-group>
            </b-form-group>

            <b-form-group>
              <label for="new-password">{{ $t('formLabelNewPassword') }}</label>
              <b-input-group>
                <b-input-group-prepend is-text class="no-border-radius-bottom">
                  <KeyPlusIcon class="form-icon" />
                </b-input-group-prepend>
                <b-form-input id="new-password" name="new-password" type="password" class="no-border-radius-bottom" v-model="password" @keyup="updateScore()" required />
              </b-input-group>
              <b-progress :value="percent" :max="100" height="5px" :variant="variant" class="password-score" id="progress"></b-progress>
              <b-tooltip target="progress" placement="bottom">
                {{ message }}
              </b-tooltip>
            </b-form-group>

            <b-form-group>
              <label for="new-password-confirm">{{ $t('formLabelNewPasswordConfirm') }}</label>
              <b-input-group>
                <b-input-group-prepend is-text>
                  <KeyPlusIcon class="form-icon" />
                </b-input-group-prepend>
                <b-form-input id="new-password-confirm" name="new-password-confirm" type="password" v-model="passwordConfirm" @keyup="checkPasswordsSame()" required />
              </b-input-group>
            </b-form-group>
            <b-button :disabled="!canContinue" type="submit" variant="primary" class="float-right" slot="footer">{{ $t('actionUpdate') }}</b-button>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'
import AtIcon from 'vue-material-design-icons/At.vue'
import KeyPlusIcon from 'vue-material-design-icons/KeyPlus.vue'
import KeyRemoveIcon from 'vue-material-design-icons/KeyRemove.vue'

export default {
  data: function () {
    return {
      user: null,
      email: '',
      oldPassword: '',
      password: '',
      passwordConfirm: '',
      score: 0,
      percent: 1,
      variant: 'danger',
      message: '',
      canContinue: false
    }
  },
  props: [ 'baseUrl' ],
  computed: {
    ...mapState([
      'token'
    ])
  },
  components: {
    AtIcon,
    KeyPlusIcon,
    KeyRemoveIcon
  },
  methods: {
    updateScore: function () {
      this.score = this.$zxcvbn(this.password).score

      switch (this.score) {
        case 0:
          this.percent = 1
          this.variant = 'danger'
          this.message = 'Your password is too guessable.'
          break
        case 1:
          this.percent = 25
          this.variant = 'danger'
          this.message = 'Your password is very guessable.'
          break
        case 2:
          this.percent = 50
          this.variant = 'warning'
          this.message = 'Your password is somewhat guessable.'
          break
        case 3:
          this.percent = 75
          this.variant = 'success'
          this.message = 'Your password is safely unguessable.'
          break
        case 4:
          this.percent = 100
          this.variant = 'success'
          this.message = 'Your password is very unguessable.'
      }

      this.checkPasswordsSame()
    },
    checkPasswordsSame: function () {
      this.canContinue = this.password && this.passwordConfirm && this.password === this.passwordConfirm && this.score >= 2
    },
    onPasswordChanged: function () {
      var vm = this

      if (this.password && this.passwordConfirm && this.password === this.passwordConfirm && this.score >= 2) {
        var update = {
          oldPassword: this.oldPassword,
          newPassword: this.password
        }

        this.apiPatchUserPassword(this.token.id, update, function (result) {
          if (result === true) {
            vm.$bvToast.toast('Update successful.', {
              title: 'Password',
              variant: 'success',
              autoHideDelay: 5000,
              appendToast: true
            })

            // Revoke the token and redirect to login
            vm.$store.dispatch('ON_TOKEN_CHANGED', null)
            vm.$router.push('/login')
          }
        }, function (err) {
          if (err.status === 401) {
            vm.$bvToast.toast('Update failed. Wrong password provided.', {
              title: 'Password',
              variant: 'danger',
              autoHideDelay: 5000,
              appendToast: true
            })
          } else {
            console.error(err)
          }
        })
      }
    },
    onEmailChanged: function () {
      var vm = this

      if (this.email && this.email.length > 0) {
        var update = {
          oldEmail: this.token.email,
          newEmail: this.email
        }

        this.apiPatchUserEmail(this.token.id, update, function (result) {
          if (result === true) {
            vm.$store.dispatch('ON_EMAIL_CHANGED', vm.email)

            vm.$bvToast.toast('Update successful.', {
              title: 'Email',
              variant: 'success',
              autoHideDelay: 5000,
              appendToast: true
            })
          }
        }, function (err) {
          console.error(err)
        })
      }
    }
  },
  mounted: function () {
    this.email = this.token.email

    var vm = this
    this.apiGetUser(this.token.id, function (result) {
      vm.user = result[0]
    })
  }
}
</script>

<style>
  .password-score {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  .no-border-radius-bottom .input-group-text {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
</style>
