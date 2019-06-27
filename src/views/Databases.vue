<template>
  <b-container fluid>
    <b-row>
      <b-col xs=12>
        <h1>Databases</h1>
        <v-server-table :url="baseUrl + 'database'"
                        :columns="databaseColumns"
                        :options="databaseOptions"
                        ref="databaseTable"
                        v-on:row-click="onDatabaseClicked($event)"
                        class="database-table">
          <b-button variant="danger"
                    slot="delete"
                    slot-scope="props"
                    @click="deleteDatabase(props.row, $event)">
            <DeleteIcon class="form-icon" />
          </b-button>
        </v-server-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import DeleteIcon from 'vue-material-design-icons/Delete.vue'

import { EventBus } from '../event-bus.js'

export default {
  data: function () {
    return {
      databaseColumns: ['systemName', 'serverName', 'description', 'delete'],
      databaseOptions: {
        requestFunction: function (data) {
          var vm = this
          return this.apiGetDatabases(data, function (result) {
            vm.dispatch('success', result)
          })
        },
        responseAdapter: function (data) {
          return data
        },
        perPage: 10,
        headings: {
          systemName: 'Database name',
          serverName: 'Server name',
          description: 'Description',
          delete: 'Delete'
        },
        sortable: ['systemName', 'serverName', 'description'],
        filterable: ['systemName', 'serverName', 'description']
      }
    }
  },
  props: [ 'baseUrl' ],
  components: {
    DeleteIcon
  },
  methods: {
    deleteDatabase: function (row, event) {
      event.preventDefault()
      event.stopPropagation()

      var vm = this
      this.$bvModal.msgBoxConfirm('Are you sure?', {
        okTitle: 'Yes',
        okVariant: 'danger',
        cancelTitle: 'No'
      })
        .then(value => {
          if (value) {
            vm.apiDeleteDatabase(row.id, function (result) {
              if (result === true) {
                vm.$bvToast.toast('Deleted successfully.', {
                  title: 'Database',
                  variant: 'success',
                  autoHideDelay: 5000,
                  appendToast: true
                })
              }

              EventBus.$emit('stats-count-changed')
              vm.$refs.databaseTable.refresh()
            })
          }
        })
    },
    onDatabaseClicked: function (event) {
      console.log(event)
    }
  }
}
</script>

<style>

</style>
