<template>
  <v-server-table ref="table"
                  :url="'' + user.id"
                  :columns=columns
                  :options=options>
    <b-button variant="danger"
              slot="delete"
              slot-scope="props"
              size="sm"
              @click="deleteUserPermission(props.row, $event)">
      <DeleteIcon class="form-icon" />
    </b-button>
    <b-form-select slot="userTypeId"
                  slot-scope="props"
                  :value="props.row.userTypeId"
                  :options="userTypeOptions"
                  @change="setUserType(props.row, $event)" />
  </v-server-table>
</template>

<script>
import DeleteIcon from 'vue-material-design-icons/Delete'
import I18nTable from './I18nTable'

export default {
  extends: I18nTable,
  data: function () {
    return {
      columns: ['systemName', 'serverName', 'userTypeId', 'delete'],
      options: {
        requestFunction: function (data) {
          var vm = this
          return this.apiGetUserPermissions(this.url, data, function (result) {
            vm.dispatch('success', result)
          })
        },
        responseAdapter: function (data) {
          return data.data
        },
        perPage: 10,
        headings: {
          systemName: () => this.$t('formLabelDatabase'),
          serverName: () => this.$t('formLabelServer'),
          userTypeId: () => this.$t('tableColumnUserType'),
          delete: () => this.$t('actionDelete')
        },
        columnsClasses: {
          delete: 'py-0 align-middle'
        },
        sortable: ['systemName', 'serverName', 'userTypeId'],
        filterable: ['systemName', 'serverName', 'userTypeId']
      },
      userTypeOptions: [{
        text: 'Administrator',
        value: 1
      }, {
        text: 'Data Curator',
        value: 4
      }, {
        text: 'Regular User',
        value: 2
      }, {
        text: 'Suspended User',
        value: 3
      }]
    }
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  components: {
    DeleteIcon
  },
  methods: {
    refresh: function () {
      this.$refs.table.refresh()
    },
    setUserType: function (row, event) {
      var vm = this
      row.userType = this.userTypeOptions.filter(t => t.value === event)[0].text
      row.userTypeId = event
      this.apiPatchUserPermission(row, function (result) {
        vm.refresh()
      })
    },
    deleteUserPermission: function (row, event) {
      var vm = this

      this.$bvModal.msgBoxConfirm(this.$t('modalMessageSure'), {
        okTitle: this.$t('genericYes'),
        okVariant: 'danger',
        cancelTitle: this.$t('genericNo')
      })
        .then(value => {
          if (value) {
            vm.apiDeleteUserPermission(row, function (result) {
              vm.refresh()
            })
          }
        })
    }
  }
}
</script>

<style>

</style>
