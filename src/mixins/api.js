import store from '../store/store'

export default {
  methods: {
    // TOKEN
    apiDeleteToken: function (user, onSuccess, onError) {
      return this.authAjax({ url: this.getBaseUrl() + 'token', method: 'DELETE', data: user, success: onSuccess, error: onError })
    },
    apiPostToken: function (admin, onSuccess, onError) {
      return this.authAjax({ url: this.getBaseUrl() + 'token', method: 'POST', data: admin, success: onSuccess, error: onError })
    },
    // STATS
    apiGetStatCounts: function (onSuccess, onError) {
      return this.authAjax({ url: this.getBaseUrl() + 'stat/count', method: 'GET', success: onSuccess, error: onError })
    },
    // USERS
    apiGetUsers: function (queryData, onSuccess, onError) {
      queryData.page -= 1
      return this.authAjax({ url: this.getBaseUrl() + 'user', method: 'GET', data: queryData, success: onSuccess, error: onError })
    },
    apiGetUser: function (userId, onSuccess, onError) {
      return this.authAjax({ url: this.getBaseUrl() + 'user/' + userId, method: 'GET', success: onSuccess, error: onError })
    },
    apiDeleteUser: function (userId, onSuccess, onError) {
      return this.authAjax({ url: this.getBaseUrl() + 'user/' + userId, method: 'DELETE', success: onSuccess, error: onError })
    },
    apiPatchUserEmail: function (userId, emailUpdate, onSuccess, onError) {
      return this.authAjax({ url: this.getBaseUrl() + 'user/' + userId + '/email', method: 'PATCH', data: emailUpdate, success: onSuccess, error: onError })
    },
    apiPatchUserPassword: function (userId, passwordUpdate, onSuccess, onError) {
      return this.authAjax({ url: this.getBaseUrl() + 'user/' + userId + '/password', method: 'PATCH', data: passwordUpdate, success: onSuccess, error: onError })
    },
    apiPatchUserGatekeeperAccess: function (userId, gatekeeperAccess, onSuccess, onError) {
      return this.authAjax({ url: this.getBaseUrl() + 'user/' + userId + '/gatekeeper', method: 'PATCH', data: gatekeeperAccess, success: onSuccess, error: onError })
    },
    // DATABASES
    apiGetDatabases: function (queryData, onSuccess, onError) {
      queryData.page -= 1
      return this.authAjax({ url: this.getBaseUrl() + 'database', method: 'GET', data: queryData, success: onSuccess, error: onError })
    },
    apiPostDatabase: function (database, onSuccess, onError) {
      return this.authAjax({ url: this.getBaseUrl() + 'database', method: 'POST', data: database, success: onSuccess, error: onError })
    },
    apiDeleteDatabase: function (databaseId, onSuccess, onError) {
      return this.authAjax({ url: this.getBaseUrl() + 'database/' + databaseId, method: 'DELETE', success: onSuccess, error: onError })
    },
    // PERMISSIONS
    apiGetUserPermissions: function (userId, queryData, onSuccess, onError) {
      queryData.page -= 1
      return this.authAjax({ url: this.getBaseUrl() + 'user/' + userId + '/permission', method: 'GET', data: queryData, success: onSuccess, error: onError })
    },
    apiPatchUserPermission: function (permission, onSuccess, onError) {
      return this.authAjax({ url: this.getBaseUrl() + 'user/' + permission.userId + '/permission', method: 'PATCH', data: permission, success: onSuccess, error: onError })
    },
    apiPostUserPermission: function (permission, onSuccess, onError) {
      return this.authAjax({ url: this.getBaseUrl() + 'user/' + permission.userId + '/permission', method: 'POST', data: permission, success: onSuccess, error: onError })
    },
    apiDeleteUserPermission: function (permission, onSuccess, onError) {
      return this.authAjax({ url: this.getBaseUrl() + 'user/' + permission.userId + '/permission', method: 'DELETE', data: permission, success: onSuccess, error: onError })
    },
    // UTILITY
    getBaseUrl () {
      return store.getters.baseUrl
    }
  }
}
