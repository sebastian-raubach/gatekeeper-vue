<template>
  <b-modal id="modal-add-institution"
           ref="addInstitutionModal"
           :title="$t('modalTitleAddInstitution')"
           :ok-title="$t('actionAdd')"
           :cancel-title="$t('actionCancel')"
           @ok="onAddInstitutionClicked" >
      <b-form @submit.prevent="onAddInstitutionClicked" autocomplete="off" ref="form" :class="validated ? 'was-validated' : 'needs-validation'" >
        <b-form-group>
          <label for="name">{{ $t('formLabelInstitutionName') }}</label>
          <b-input-group>
            <b-form-input id="name" name="name" autocomplete="off" v-model="institution.name" required />
          </b-input-group>
        </b-form-group>
        <b-form-group>
          <label for="acronym">{{ $t('formLabelInstitutionAcronym') }}</label>
          <b-input-group>
            <b-form-input id="acronym" name="acronym" autocomplete="off" v-model="institution.acronym" required />
          </b-input-group>
        </b-form-group>
        <b-form-group>
          <label for="address">{{ $t('formLabelInstitutionAddress') }}</label>
          <b-input-group>
            <b-form-textarea id="address" name="address" autocomplete="off" v-model="institution.address" required />
          </b-input-group>
        </b-form-group>
      </b-form>
    </b-modal>
</template>

<script>
export default {
  data: function () {
    return {
      validated: false,
      institution: {
        name: null,
        acronym: null,
        address: null
      }
    }
  },
  methods: {
    show () {
      var vm = this
      this.$nextTick(function () {
        vm.$refs.addInstitutionModal.show()
      })
    },
    onAddInstitutionClicked: function (event) {
      event.preventDefault()
      this.validated = true
      // Check that all fields are set
      if (!this.institution.name || !this.institution.acronym || !this.institution.address || !this.$refs.form.checkValidity()) {
        return
      }

      // Send the new institution to the server
      var vm = this
      this.apiPostInstitution(this.institution, function (result) {
        vm.$refs.addInstitutionModal.hide()
        vm.$emit('institutions-updated')
      })
    }
  }
}
</script>

<style>

</style>
