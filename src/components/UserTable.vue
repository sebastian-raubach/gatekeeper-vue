<template>
  <div>
    <v-server-table :columns="columns"
                    :options="options"
                    ref="table"
                    v-on:row-click="onRowClicked($event)"
                    class="hover-select-table table-with-actions" >
      <div slot="afterTable">
        <b-button class="action" @click="$refs.addUserModal.show()"><AccountPlusIcon class="button-icon" /> {{ $t('actionAddUser') }}</b-button>
      </div>
    </v-server-table>
    <AddUserModal ref="addUserModal" @add-institution-clicked="$refs.addInstitutionModal.show()" @user-added="refresh()" />
    <AddInstitutionModal ref="addInstitutionModal" @institutions-updated="$refs.addUserModal.updateInstitutions()" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import I18nTable from './I18nTable'
import AddInstitutionModal from './modal/AddInstitutionModal'
import AddUserModal from './modal/AddUserModal'
import AccountPlusIcon from 'vue-material-design-icons/AccountPlus'

export default {
  extends: I18nTable,
  data: function () {
    return {
      user: null,
      institutions: null,
      columns: ['username', 'fullName', 'emailAddress', 'name', 'acronym', 'address'],
      options: {
        requestFunction: function (data) {
          var vm = this
          return this.apiGetUsers(data, function (result) {
            vm.dispatch('success', result)
          })
        },
        responseAdapter: function (data) {
          return data.data
        },
        rowClassCallback: (row) => {
          return (this.user && row.id === this.user.id) ? 'table-primary' : ''
        },
        perPage: 10,
        headings: {
          username: () => this.$t('tableColumnUsername'),
          fullName: () => this.$t('tableColumnFullName'),
          emailAddress: () => this.$t('tableColumnEmail'),
          name: () => this.$t('tableColumnInstituteName'),
          acronym: () => this.$t('tableColumnInstituteAcronym'),
          address: () => this.$t('tableColumnInstituteAddress')
        },
        sortable: ['username', 'fullName', 'emailAddress', 'name', 'acronym', 'address'],
        filterable: ['username', 'fullName', 'emailAddress', 'name', 'acronym', 'address']
      }
    }
  },
  components: {
    AccountPlusIcon,
    AddInstitutionModal,
    AddUserModal
  },
  computed: {
    ...mapState([
      'baseUrl'
    ])
  },
  methods: {
    update: function () {
      this.newUser.password = this.$refs.password.getPassword()
      this.checkForm()
    },
    checkForm: function () {
      var result = true
      result = result && this.$refs.password.valid()
      result = result && this.newUser.username
      result = result && this.newUser.fullName
      result = result && (this.newUser.institution.id || this.newUser.institution.name)
      result = result && this.newUser.email
      this.canContinue = result
    },
    onRowClicked: function (event) {
      this.user = event.row

      this.$emit('user-selected', this.user)
    },
    refresh: function () {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style>

</style>
