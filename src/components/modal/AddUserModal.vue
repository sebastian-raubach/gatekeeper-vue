<template>
  <b-modal id="modal-add-user"
           ref="addUserModal"
           :title="$t('modalTitleAddUser')"
           :ok-disabled="!canContinue"
           :ok-title="$t('actionAdd')"
           :cancel-title="$t('actionCancel')"
           @ok="onSubmitNewUser" >
    <b-form @submit.prevent="onSubmitNewUser" autocomplete="off" ref="form" :class="validated ? 'was-validated' : 'needs-validation'" >
      <b-form-group>
        <label for="emailAddress">{{ $t('formLabelEmail') }}</label>
        <b-input-group>
          <b-input-group-prepend is-text>
            <AtIcon class="form-icon" />
          </b-input-group-prepend>
          <b-form-input id="emailAddress" name="emailAddress" type="email" autocomplete="off" v-model="user.emailAddress" required @keyup="checkForm" />
        </b-input-group>
      </b-form-group>
      <b-form-group>
        <label for="fullName">{{ $t('formLabelFullName') }}</label>
        <b-input-group>
          <b-input-group-prepend is-text>
            <PencilIcon class="form-icon" />
          </b-input-group-prepend>
          <b-form-input id="fullName" name="fullName" autocomplete="off" v-model="user.fullName" required @keyup="checkForm" />
        </b-input-group>
      </b-form-group>
      <b-form-group>
        <label for="institution">{{ $t('formLabelInstitution') }}</label>
        <b-input-group>
          <b-input-group-prepend is-text>
            <OfficeBuildingIcon class="form-icon" />
          </b-input-group-prepend>
          <b-form-select id="institution"
                          name="institution"
                          :options="institutions"
                          v-model="user.institutionId"
                          @change="checkForm" />
          <b-input-group-append>
            <b-button>
              <PlusBoxIcon class="form-icon" @click="$emit('add-institution-clicked')" />
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
      <PasswordInput ref="password" @change="update"/>
    </b-form>
  </b-modal>
</template>

<script>
import AtIcon from 'vue-material-design-icons/At'
import OfficeBuildingIcon from 'vue-material-design-icons/OfficeBuilding'
import PasswordInput from '../PasswordInput'
import PencilIcon from 'vue-material-design-icons/Pencil'
import PlusBoxIcon from 'vue-material-design-icons/PlusBox'
import { EventBus } from '../../event-bus.js'

export default {
  data: function () {
    return {
      validated: false,
      institutions: null,
      canContinue: false,
      user: {
        username: null,
        password: null,
        fullName: null,
        emailAddress: null,
        passwordConfirm: null,
        institutionId: null
      }
    }
  },
  components: {
    AtIcon,
    OfficeBuildingIcon,
    PasswordInput,
    PencilIcon,
    PlusBoxIcon
  },
  methods: {
    show () {
      var vm = this
      this.$nextTick(function () {
        vm.$refs.addUserModal.show()
      })
    },
    updateInstitutions: function () {
      var vm = this
      this.apiGetInstitutions(function (result) {
        var mapped = result.data.map(function (i) {
          return {
            value: i.id,
            text: i.name
          }
        })
        vm.user.institutionId = mapped[0].value

        vm.institutions = mapped
      })
    },
    update: function () {
      this.user.password = this.$refs.password.getPassword()
      this.checkForm()
    },
    checkForm: function () {
      var result = true
      result = result && this.$refs.password.valid()
      result = result && this.user.fullName
      result = result && this.user.institutionId
      result = result && this.user.emailAddress
      this.canContinue = result
      return result
    },
    onSubmitNewUser: function (event) {
      event.preventDefault()
      this.validated = true
      if (!this.checkForm() || !this.$refs.form.checkValidity()) {
        return
      }

      delete this.user.passwordConfirm

      this.user.username = this.user.emailAddress

      var vm = this
      this.apiPostUser(this.user, function (result) {
        vm.$refs.addUserModal.hide()
        vm.$emit('user-added')
        EventBus.$emit('stats-count-changed')
        vm.resetUser()
      })
    },
    resetUser: function () {
      this.user = {
        username: null,
        password: null,
        fullName: null,
        emailAddress: null,
        passwordConfirm: null,
        institutionId: null
      }
    }
  },
  mounted: function () {
    this.resetUser()
    this.updateInstitutions()
  }
}
</script>

<style>

</style>
