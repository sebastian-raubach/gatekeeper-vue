<template>
  <div>
    <b-form-group>
      <label for="password">{{ $t('formLabelPassword') }}</label>
      <b-input-group>
        <b-input-group-prepend is-text class="no-border-radius-bottom">
          <KeyPlusIcon class="form-icon" />
        </b-input-group-prepend>
        <b-form-input id="password" name="password" type="password" class="no-border-radius-bottom" autocomplete="new-password" v-model="password" @keyup="updateScore()" required />
      </b-input-group>
      <b-progress :value="percent" :max="100" height="5px" :variant="variant" class="password-score" id="progress"></b-progress>
      <b-tooltip target="progress" placement="bottom">
        {{ message }}
      </b-tooltip>
    </b-form-group>

    <b-form-group>
      <label for="password-confirm">{{ $t('formLabelPasswordConfirm') }}</label>
      <b-input-group>
        <b-input-group-prepend is-text>
          <KeyPlusIcon class="form-icon" />
        </b-input-group-prepend>
        <b-form-input id="password-confirm" name="password-confirm" type="password" autocomplete="new-password" v-model="passwordConfirm" @keyup="checkPasswordsSame()" required />
      </b-input-group>
    </b-form-group>
  </div>
</template>

<script>
import KeyPlusIcon from 'vue-material-design-icons/KeyPlus.vue'

export default {
  data: function () {
    return {
      password: null,
      passwordConfirm: null,
      score: 0,
      variant: 'danger',
      percent: 1,
      message: '',
      correct: false
    }
  },
  components: {
    KeyPlusIcon
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
      this.correct = this.password && this.passwordConfirm && this.password === this.passwordConfirm && this.score >= 2

      this.$emit('change')
    },
    valid: function () {
      return this.correct
    },
    getPassword: function () {
      return this.password
    },
    getPasswordConfirm: function () {
      return this.passwordConfirm
    },
    getScore: function () {
      return this.score
    }
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
