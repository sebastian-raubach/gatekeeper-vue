<template>
  <b-col>
    <h1>Users</h1>
    <v-server-table :url="baseUrl + 'user'"
                    :columns="userColumns"
                    :options="userOptions"
                    ref="userTable"
                    v-on:row-click="onRowClicked($event)"
                    class="user-table">
    </v-server-table>
    <template v-if="user">
      <b-row>
        <b-col xs=12 md=6>
          <b-card header-tag="header" class="mb-3">
            <h6 slot="header" class="mb-0">User details</h6>
            <dl>
              <dt>Username</dt><dd>{{ user.username }}</dd>
              <dt>Full name</dt><dd>{{ user.fullName }}</dd>
              <dt>Email</dt><dd>{{ user.emailAddress }}</dd>
              <dt>Institution</dt><dd>{{ user.name + ' (' + user.acronym + ') ' + user.address}}</dd>
            </dl>
          </b-card>
        </b-col>
        <b-col xs=12 md=6>
          <b-card header-tag="header" class="mb-3">
            <h6 slot="header" class="mb-0">Actions</h6>
            <h5>Access to Gatekeeper</h5>
            <b-form-checkbox
              value="1"
              unchecked-value="0"
              v-model="user.gatekeeperAccess"
              @change="onGatekeeperAccessChanged($event)">
              Should this user be allowed to change their email address and password?
            </b-form-checkbox>
            <h5 class="mt-3">Delete user</h5>
            <p>Click on the button below to delete this user account.</p>
            <b-button variant="danger" @click="onDeleteUserClicked()">Delete</b-button>
          </b-card>
        </b-col>
        <b-col xs=12 md=6>
          <b-card header-tag="header" class="mb-3">
            <h6 slot="header" class="mb-0">Permissions</h6>
            <v-server-table :url="'' + user.id"
                            ref="permissionsTable"
                            :columns=permissionColumns
                            :options=permissionOptions>
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
          </b-card>
        </b-col>
        <b-col xs=12 md=6>
          <b-card header-tag="header" class="mb-3">
            <h6 slot="header" class="mb-0">Grant permission</h6>
            <b-tabs content-class="mt-3">
              <b-tab title="Existing" active>
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
                  <b-button type="submit" variant="primary" class="mt-3">Add</b-button>
                </b-form>
              </b-tab>
              <b-tab title="New">
                <b-form @submit.prevent="onSubmitNewPermission">
                  <b-input-group class="mt-3">
                    <b-input-group-prepend is-text>
                      <DatabaseIcon class="form-icon" />
                    </b-input-group-prepend>
                    <b-form-input  v-model="newPermission.database"
                                   placeholder="Database"
                                   required />
                  </b-input-group>
                  <b-input-group class="mt-3">
                    <b-input-group-prepend is-text>
                      <ServerIcon class="form-icon" />
                    </b-input-group-prepend>
                    <b-form-input  v-model="newPermission.server"
                                   placeholder="Server"
                                   required />
                  </b-input-group>
                  <b-input-group class="mt-3">
                    <b-input-group-prepend is-text>
                      <PencilIcon class="form-icon" />
                    </b-input-group-prepend>
                    <b-form-input  v-model="newPermission.description"
                                   placeholder="Description"
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
                  <b-button type="submit" variant="primary" class="mt-3">Add</b-button>
                </b-form>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </template>
  </b-col>
</template>

<script>
import AccountStarIcon from 'vue-material-design-icons/AccountStar.vue'
import DatabaseIcon from 'vue-material-design-icons/Database.vue'
import DeleteIcon from 'vue-material-design-icons/Delete.vue'
import PencilIcon from 'vue-material-design-icons/Pencil.vue'
import ServerIcon from 'vue-material-design-icons/Server.vue'

import { EventBus } from '../event-bus.js'

export default {
  data: function () {
    return {
      userColumns: ['username', 'fullName', 'emailAddress', 'name', 'acronym', 'address'],
      userOptions: {
        requestFunction: function (data) {
          var vm = this
          return this.apiGetUsers(data, function (result) {
            vm.dispatch('success', result)
          })
        },
        responseAdapter: function (data) {
          return data
        },
        perPage: 10,
        headings: {
          username: 'Username',
          fullName: 'Full name',
          emailAddress: 'Email',
          name: 'Institute name',
          acronym: 'Institute acronym',
          address: 'Institute address'
        },
        sortable: ['username', 'fullName', 'emailAddress', 'name', 'acronym', 'address'],
        filterable: ['username', 'fullName', 'emailAddress', 'name', 'acronym', 'address']
      },
      permissionColumns: ['systemName', 'serverName', 'userType', 'delete'],
      permissionOptions: {
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
          systemName: 'Database name',
          serverName: 'Server name',
          userType: 'User type',
          delete: 'Delete'
        },
        sortable: ['systemName', 'serverName', 'userType'],
        filterable: ['systemName', 'serverName', 'userType']
      },
      user: null,
      userTypeOptions: ['Administrator', 'Regular User', 'Suspended User'],
      databases: [],
      newPermission: {
        database: null,
        server: null,
        description: null,
        userType: 'Regular User'
      }
    }
  },
  components: {
    AccountStarIcon,
    DatabaseIcon,
    DeleteIcon,
    PencilIcon,
    ServerIcon
  },
  props: [ 'baseUrl' ],
  methods: {
    onRowClicked: function (event) {
      this.user = event.row

      var vm = this
      this.$nextTick(function () {
        vm.$refs.permissionsTable.refresh()
      })
    },
    onGatekeeperAccessChanged: function (event) {
      this.apiPatchUserGatekeeperAccess(this.user.id, event)
    },
    deleteUserPermission: function (row, event) {
      var vm = this

      this.$bvModal.msgBoxConfirm('Are you sure?', {
        okTitle: 'Yes',
        okVariant: 'danger',
        cancelTitle: 'No'
      })
        .then(value => {
          if (value) {
            vm.apiDeleteUserPermission(row, function (result) {
              vm.$refs.permissionsTable.refresh()
            })
          }
        })
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

      this.$bvModal.msgBoxConfirm('Are you sure?', {
        okTitle: 'Yes',
        okVariant: 'danger',
        cancelTitle: 'No'
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
    this.apiGetDatabases(function (result) {
      result.forEach(function (d) {
        d.text = d.serverName + ' -> ' + d.systemName
      })

      vm.databases = result
    })
  }
}
</script>

<style>
  .user-table tbody tr:hover {
    cursor: pointer;
  }
</style>
