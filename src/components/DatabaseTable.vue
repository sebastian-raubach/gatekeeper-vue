<template>
  <div>
    <v-server-table :url="baseUrl + 'database'"
                    :columns="columns"
                    :options="options"
                    ref="table"
                    v-on:row-click="onDatabaseClicked($event)"
                    class="hover-select-table table-with-actions">
      <b-button variant="danger"
                slot="delete"
                slot-scope="props"
                size="sm"
                @click="deleteDatabase(props.row, $event)">
        <DeleteIcon class="form-icon" />
      </b-button>
      <div slot="afterTable">
        <b-button class="action" @click="$refs.addDatabaseModal.show()"><DatabasePlusIcon class="button-icon" /> {{ $t('actionAddDatabase') }}</b-button>
      </div>
    </v-server-table>
    <AddDatabaseModal ref="addDatabaseModal" @databases-updated="$refs.table.refresh()" />
  </div>
</template>

<script>
import DatabasePlusIcon from 'vue-material-design-icons/DatabasePlus'
import DeleteIcon from 'vue-material-design-icons/Delete'
import AddDatabaseModal from './modal/AddDatabaseModal'
import { EventBus } from '../event-bus.js'
import I18nTable from './I18nTable'
import { mapState } from 'vuex'

export default {
  extends: I18nTable,
  data: function () {
    return {
      database: null,
      columns: ['systemName', 'serverName', 'description', 'delete'],
      options: {
        requestFunction: function (data) {
          var vm = this
          return this.apiGetDatabases(data, function (result) {
            vm.dispatch('success', result)
          })
        },
        rowClassCallback: (row) => {
          return (this.database && row.id === this.database.id) ? 'table-primary' : ''
        },
        responseAdapter: function (data) {
          return data.data
        },
        perPage: 10,
        headings: {
          systemName: () => this.$t('formLabelDatabase'),
          serverName: () => this.$t('formLabelServer'),
          description: () => this.$t('formLabelDescription'),
          delete: () => this.$t('actionDelete')
        },
        columnsClasses: {
          delete: 'py-0 align-middle'
        },
        sortable: ['systemName', 'serverName', 'description'],
        filterable: ['systemName', 'serverName', 'description']
      }
    }
  },
  computed: {
    ...mapState([
      'baseUrl'
    ])
  },
  components: {
    AddDatabaseModal,
    DatabasePlusIcon,
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
      this.database = event.row

      this.$emit('database-selected', this.database)
    }
  }
}
</script>

<style>

</style>
