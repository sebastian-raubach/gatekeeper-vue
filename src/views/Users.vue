<template>
  <b-container fluid class="mt-3">
    <h1>{{ $t('pageUsersHeading') }}</h1>
    <UserTable ref="userTable"
               v-on:user-selected="(user) => onUserSelected(user)" />
    <template v-if="user">
      <b-row>
        <b-col xs=12 md=6>
          <b-card header-tag="header" class="mb-3">
            <h6 slot="header" class="mb-0">{{ $t('pageUsersHeadingDetails') }}</h6>
            <dl>
              <dt>{{ $t('tableColumnUsername') }}</dt><dd>{{ user.username }}</dd>
              <dt>{{ $t('tableColumnFullName') }}</dt><dd>{{ user.fullName }}</dd>
              <dt>{{ $t('tableColumnEmail') }}</dt><dd>{{ user.emailAddress }}</dd>
              <dt>{{ $t('tableColumnInstitute') }}</dt><dd>{{ getInstitution() }}</dd>
            </dl>
          </b-card>
        </b-col>
        <b-col xs=12 md=6>
          <b-card header-tag="header" class="mb-3">
            <h6 slot="header" class="mb-0">{{ $t('pageUsersHeadingActions') }}</h6>
            <h5>{{ $t('pageUsersHeadingGatekeeperAccess') }}</h5>
            <b-form-checkbox
              value="1"
              unchecked-value="0"
              v-model="user.gatekeeperAccess"
              @change="onGatekeeperAccessChanged($event)">
              {{ $t('pageUsersTextGatekeeperAccess') }}
            </b-form-checkbox>
            <h5 class="mt-3">{{ $t('pageUsersHeadingDeleteUser') }}</h5>
            <p>{{ $t('pageUsersTextDeleteUser') }}</p>
            <b-button variant="danger" @click="onDeleteUserClicked()">{{ $t('actionDelete') }}</b-button>
          </b-card>
        </b-col>
        <b-col xs=12 md=6>
          <b-card header-tag="header" class="mb-3">
            <h6 slot="header" class="mb-0">{{ $t('pageUsersHeadingPermissions') }}</h6>
            <UserPermissionTable :user="user"
                                 ref="permissionsTable" />
          </b-card>
        </b-col>
        <b-col xs=12 md=6>
          <b-card header-tag="header" class="mb-3">
            <h6 slot="header" class="mb-0">{{ $t('pageUsersHeadingGrantPermission') }}</h6>
            <b-tabs content-class="mt-3">
              <b-tab :title="$t('pageUsersTabExisting')" active>
                <b-form @submit.prevent="onSubmitExistingPermission">
                  <b-input-group class="mt-3">
                    <b-input-group-prepend is-text>
                      <DatabaseIcon class="form-icon" />
                    </b-input-group-prepend>
                    <b-form-select v-model="newPermission.database"
                                   :options="databases"
                                   value-field="id"
                                   required />
                  </b-input-group>
                  <b-input-group class="mt-3">
                    <b-input-group-prepend is-text>
                      <AccountStarIcon class="form-icon" />
                    </b-input-group-prepend>
                    <b-form-select v-model="newPermission.userType"
                                   :options="userTypeOptions"
                                   required />
                  </b-input-group>
                  <b-button type="submit" variant="primary" class="mt-3">{{ $t('actionAdd') }}</b-button>
                </b-form>
              </b-tab>
              <b-tab :title="$t('pageUsersTabNew')">
                <b-form @submit.prevent="onSubmitNewPermission">
                  <b-input-group class="mt-3">
                    <b-input-group-prepend is-text>
                      <DatabaseIcon class="form-icon" />
                    </b-input-group-prepend>
                    <b-form-input  v-model="newPermission.database"
                                   :placeholder="$t('formLabelDatabase')"
                                   required />
                  </b-input-group>
                  <b-input-group class="mt-3">
                    <b-input-group-prepend is-text>
                      <ServerIcon class="form-icon" />
                    </b-input-group-prepend>
                    <b-form-input  v-model="newPermission.server"
                                   :placeholder="$t('formLabelServer')"
                                   required />
                  </b-input-group>
                  <b-input-group class="mt-3">
                    <b-input-group-prepend is-text>
                      <PencilIcon class="form-icon" />
                    </b-input-group-prepend>
                    <b-form-input  v-model="newPermission.description"
                                   :placeholder="$t('formLabelDescription')"
                                   required />
                  </b-input-group>
                  <b-input-group class="mt-3">
                    <b-input-group-prepend is-text>
                      <AccountStarIcon class="form-icon" />
                    </b-input-group-prepend>
                    <b-form-select v-model="newPermission.userType"
                                   :options="userTypeOptions"
                                   required />
                  </b-input-group>
                  <b-button type="submit" variant="primary" class="mt-3">{{ $t('actionAdd') }}</b-button>
                </b-form>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </template>
  </b-container>
</template>

<script>
import AccountStarIcon from 'vue-material-design-icons/AccountStar.vue'
import DatabaseIcon from 'vue-material-design-icons/Database.vue'
import PencilIcon from 'vue-material-design-icons/Pencil.vue'
import ServerIcon from 'vue-material-design-icons/Server.vue'

import UserTable from '../components/UserTable'
import UserPermissionTable from '../components/UserPermissionTable'

import { EventBus } from '../event-bus.js'

export default {
  data: function () {
    return {
      user: null,
      databases: [],
      newPermission: {
        database: null,
        server: null,
        description: null,
        userType: 'Regular User'
      },
      userTypeOptions: ['Administrator', 'Data Curator', 'Regular User', 'Suspended User']
    }
  },
  components: {
    AccountStarIcon,
    DatabaseIcon,
    PencilIcon,
    ServerIcon,
    UserTable,
    UserPermissionTable
  },
  methods: {
    getInstitution: function () {
      var result = ''

      if (this.user.name) {
        result += this.user.name
      }
      if (this.user.acronym) {
        result += ' (' + this.user.acronym + ')'
      }
      if (this.user.address) {
        result += ' - ' + this.user.address
      }
      if (result.length === 0) {
        result = '-'
      }

      return result
    },
    onUserSelected: function (user) {
      this.user = user

      var vm = this
      this.$nextTick(function () {
        vm.$refs.permissionsTable.refresh()
      })
    },
    onGatekeeperAccessChanged: function (event) {
      this.apiPatchUserGatekeeperAccess(this.user.id, event)
    },
    resetNewPermission: function () {
      this.newPermission = {
        database: null,
        server: null,
        description: null,
        userType: 'Regular User'
      }
    },
    setUserType: function (row, event) {
      var vm = this
      row.userType = event
      row.userTypeId = this.userTypeOptions.indexOf(event) + 1
      this.apiPatchUserPermission(row, function (result) {
        vm.$refs.permissionsTable.refresh()
      })
    },
    onDeleteUserClicked: function () {
      var vm = this

      this.$bvModal.msgBoxConfirm(this.$t('modalMessageSure'), {
        okTitle: this.$t('genericYes'),
        okVariant: 'danger',
        cancelTitle: this.$t('genericNo')
      })
        .then(value => {
          if (value) {
            vm.apiDeleteUser(this.user.id, function (result) {
              vm.user = null
              vm.update()
            })
          }
        })
    },
    update: function () {
      this.$refs.userTable.refresh()

      EventBus.$emit('stats-count-changed')
    },
    onSubmitNewPermission: function () {
      var vm = this
      if (this.newPermission.database && this.newPermission.server && this.newPermission.userType) {
        var toSend = {
          systemName: this.newPermission.database,
          serverName: this.newPermission.server,
          description: this.newPermission.description
        }

        this.apiPostDatabase(toSend, function (result) {
          if (result) {
            var toSend = {
              userId: vm.user.id,
              databaseId: result,
              userTypeId: vm.userTypeOptions.indexOf(vm.newPermission.userType) + 1
            }

            EventBus.$emit('stats-count-changed')

            vm.apiPostUserPermission(toSend, function (result) {
              vm.$refs.permissionsTable.refresh()
              vm.resetNewPermission()
            })
          }
        })
      }
    },
    onSubmitExistingPermission: function () {
      var vm = this
      if (this.newPermission.database && this.newPermission.userType) {
        var toSend = {
          userId: this.user.id,
          databaseId: this.newPermission.database,
          userTypeId: this.userTypeOptions.indexOf(this.newPermission.userType) + 1
        }

        this.apiPostUserPermission(toSend, function (result) {
          vm.resetNewPermission()
          vm.$refs.permissionsTable.refresh()
        })
      }
    }
  },
  mounted: function () {
    var vm = this
    this.apiGetDatabases({ page: 1, limit: Number.MAX_SAFE_INTEGER }, function (result) {
      if (result && result.data) {
        result.data.forEach(function (d) {
          d.text = d.serverName + ' -> ' + d.systemName
        })

        vm.databases = result.data
      }
    })
  }
}
</script>

<style>
</style>
