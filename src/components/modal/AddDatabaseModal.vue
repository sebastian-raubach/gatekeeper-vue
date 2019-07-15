<template>
  <b-modal id="modal-add-database"
           ref="addDatabaseModal"
           :title="$t('modalTitleAddDatabase')"
           :ok-title="$t('actionAdd')"
           :cancel-title="$t('actionCancel')"
           @ok="onAddDatabaseClicked" >
      <b-form @submit.prevent="onAddDatabaseClicked" autocomplete="off" ref="form" :class="validated ? 'was-validated' : 'needs-validation'" >
        <b-form-group>
          <label for="systemName">{{ $t('formLabelDatabase') }}</label>
          <b-input-group>
            <b-form-input id="systemName" name="systemName" autocomplete="off" v-model="database.systemName" required />
          </b-input-group>
        </b-form-group>
        <b-form-group>
          <label for="serverName">{{ $t('formLabelServer') }}</label>
          <b-input-group>
            <b-form-input id="serverName" name="serverName" autocomplete="off" v-model="database.serverName" required />
          </b-input-group>
        </b-form-group>
        <b-form-group>
          <label for="description">{{ $t('formLabelDescription') }}</label>
          <b-input-group>
            <b-form-textarea id="description" name="description" autocomplete="off" v-model="database.description" />
          </b-input-group>
        </b-form-group>
      </b-form>
    </b-modal>
</template>

<script>
import { EventBus } from '../../event-bus.js'

export default {
  data: function () {
    return {
      validated: false,
      database: {
        systemName: null,
        serverName: null,
        description: null
      }
    }
  },
  methods: {
    show () {
      var vm = this
      this.$nextTick(function () {
        vm.$refs.addDatabaseModal.show()
      })
    },
    onAddDatabaseClicked: function (event) {
      event.preventDefault()
      this.validated = true
      // Check that all fields are set
      if (!this.database.systemName || !this.database.serverName || !this.$refs.form.checkValidity()) {
        return
      }

      // Send the new database to the server
      var vm = this
      this.apiPostDatabase(this.database, function (result) {
        vm.$refs.addDatabaseModal.hide()
        vm.$emit('databases-updated')
        vm.resetDatabase()
        EventBus.$emit('stats-count-changed')
      })
    },
    resetDatabase: function () {
      this.database = {
        systemName: null,
        serverName: null,
        description: null
      }
    }
  },
  mounted: function () {
    this.resetDatabase()
  }
}
</script>

<style>

</style>
