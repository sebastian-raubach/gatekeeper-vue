<template>
  <v-server-table :url="'' + user.id"
                  ref="table"
                  :columns=columns
                  :options=options>
    <b-button variant="danger"
              slot="delete"
              slot-scope="props"
              @click="deleteUserPermission(props.row, $event)">
      <DeleteIcon class="form-icon" />
    </b-button>
    <b-form-select slot="userType"
                  slot-scope="props"
                  :value="props.row.userType"
                  :options="userTypeOptions"
                  @change="setUserType(props.row, $event)" />
  </v-server-table>
</template>

<script>
import DeleteIcon from 'vue-material-design-icons/Delete'

export default {
  data: function () {
    return {
      columns: ['systemName', 'serverName', 'userType', 'delete'],
      options: {
        requestFunction: function (data) {
          var vm = this
          return this.apiGetUserPermissions(this.url, data, function (result) {
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
          userType: () => this.$t('tableColumnUserType'),
          delete: () => this.$t('actionDelete')
        },
        sortable: ['systemName', 'serverName', 'userType'],
        filterable: ['systemName', 'serverName', 'userType']
      },
      userTypeOptions: ['Administrator', 'Regular User', 'Suspended User']
    }
  },
  props: {
    baseUrl: {
      type: String,
      required: true
    },
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
      row.userType = event
      row.userTypeId = this.userTypeOptions.indexOf(event) + 1
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
