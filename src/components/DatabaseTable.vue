<template>
  <v-server-table :url="baseUrl + 'database'"
                  :columns="columns"
                  :options="options"
                  ref="table"
                  v-on:row-click="onDatabaseClicked($event)"
                  class="hover-select-table">
    <b-button variant="danger"
              slot="delete"
              slot-scope="props"
              @click="deleteDatabase(props.row, $event)">
      <DeleteIcon class="form-icon" />
    </b-button>
  </v-server-table>
</template>

<script>
import DeleteIcon from 'vue-material-design-icons/Delete.vue'
import { EventBus } from '../event-bus.js'

export default {
  data: function () {
    return {
      columns: ['systemName', 'serverName', 'description', 'delete'],
      options: {
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
          systemName: () => this.$t('formLabelDatabase'),
          serverName: () => this.$t('formLabelServer'),
          description: () => this.$t('formLabelDescription'),
          delete: () => this.$t('actionDelete')
        },
        sortable: ['systemName', 'serverName', 'description'],
        filterable: ['systemName', 'serverName', 'description']
      }
    }
  },
  props: {
    baseUrl: {
      type: String,
      required: true
    }
  },
  components: {
    DeleteIcon
  },
  methods: {
    deleteDatabase: function (row, event) {
      event.preventDefault()
      event.stopPropagation()

      var vm = this
      this.$bvModal.msgBoxConfirm(this.$t('modalMessageSure'), {
        okTitle: this.$t('genericYes'),
        okVariant: 'danger',
        cancelTitle: this.$t('genericNo')
      })
        .then(value => {
          if (value) {
            vm.apiDeleteDatabase(row.id, function (result) {
              if (result === true) {
                vm.$bvToast.toast(vm.$t('toastDeletedSuccessfully'), {
                  title: vm.$t('formLabelDatabase'),
                  variant: 'success',
                  autoHideDelay: 5000,
                  appendToast: true
                })
              }

              EventBus.$emit('stats-count-changed')
              vm.$refs.table.refresh()
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
