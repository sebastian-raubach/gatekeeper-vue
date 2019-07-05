export default {
  methods: {
    getPaginationTexts () {
      return {
        count: this.$t('paginationCount'),
        first: this.$t('paginationFirst'),
        last: this.$t('paginationLast'),
        filter: this.$t('paginationFilter'),
        filterPlaceholder: this.$t('paginationFilterPlaceholder'),
        limit: this.$t('paginationLimit'),
        page: this.$t('paginationPage'),
        noResults: this.$t('paginationNoResult'),
        filterBy: this.$t('paginationFilterBy'),
        loading: this.$t('paginationLoading'),
        defaultOption: this.$t('paginationDefaultOption'),
        columns: this.$t('paginationColumns')
      }
    },
    authAjax ({ url = null, method = 'GET', data = null, dataType = 'json', success = null, error = null }) {
      var vm = this

      var requestData = null

      // Stringify the data object for non-GET requests
      if (data) {
        requestData = method === 'GET' ? data : JSON.stringify(data)
      }

      return this.$jQuery.ajax({
        url: url,
        method: method,
        dataType: dataType,
        contentType: 'application/json; charset=utf-8',
        crossDomain: true,
        data: requestData,
        headers: this.getAuth(),
        xhrFields: {
          withCredentials: true
        }
      })
        .fail(function (jqXHR, textStatus) {
          if (textStatus === 'timeout') {
            vm.$bvToast.toast('Request to the server timed out.', {
              title: 'Error',
              variant: 'danger',
              autoHideDelay: 5000,
              appendToast: true
            })
          }

          // Log the user out if the result is forbidden and no error method has been provided
          // Otherwise, we assume that the calling method takes care of the error
          if (!error) {
            if (jqXHR.status === 403) {
              vm.$store.dispatch('ON_TOKEN_CHANGED', null)
              vm.$router.push('/gk/login')
            } else if (process.env.NODE_ENV === 'development') {
              console.error(jqXHR)
            }
          } else {
            error(jqXHR)
          }
        })
        .done(function (data) {
          var t = vm.$store.getters.token

          // Check if the token is still valid. Renew it if so.
          if (t && ((new Date().getTime() - new Date(t.createdOn).getTime()) <= t.lifetime)) {
            t.createdOn = new Date().getTime()
            vm.$store.dispatch('ON_TOKEN_CHANGED', t)
          }

          if (success) {
            success(data)
          }
        })
    },
    unauthAjax ({ url = null, method = 'GET', data = null, dataType = 'json', success = null, error = null }) {
      var vm = this

      var requestData = null

      // Stringify the data object for non-GET requests
      if (data) {
        requestData = method === 'GET' ? data : JSON.stringify(data)
      }

      return this.$jQuery.ajax({
        url: url,
        method: method,
        dataType: dataType,
        contentType: 'application/json; charset=utf-8',
        crossDomain: true,
        data: requestData
      })
        .fail(function (jqXHR, textStatus) {
          if (textStatus === 'timeout') {
            vm.$bvToast.toast('Request to the server timed out.', {
              title: 'Error',
              variant: 'danger',
              autoHideDelay: 5000,
              appendToast: true
            })
          }
          if (error) {
            error(jqXHR)
          } else if (process.env.NODE_ENV === 'development') {
            console.error(jqXHR)
          }
        })
        .done(function (data) {
          if (success) {
            success(data)
          }
        })
    },
    getAuth () {
      var t = this.$store.getters.token

      // Check if the token is still valid
      if (t && ((new Date().getTime() - new Date(t.createdOn).getTime()) > t.lifetime)) {
        t = null
        this.$store.dispatch('ON_TOKEN_CHANGED', t)
      }

      return {
        'Authorization': 'Bearer ' + (t ? t.token : null)
      }
    }
  }
}
