import axios from 'axios'
import store from '../store/store'

export default {
  methods: {
    getBaseUrl () {
      return store.getters.baseUrl
    },
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
        url: this.getBaseUrl() + url,
        method: method,
        dataType: dataType,
        contentType: 'application/json; charset=utf-8',
        crossDomain: true,
        data: requestData,
        headers: {
          'Authorization': 'Bearer ' + this.getToken()
        },
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
    // authAjax ({ url = null, method = 'GET', data = null, dataType = 'json', success = null, error = null }) {
    //   var vm = this
    //   var requestData = null
    //   var requestParams = null

    //   // Stringify the data object for non-GET requests
    //   if (data !== null || data !== undefined) {
    //     if (method === 'GET') {
    //       requestParams = data
    //     } else {
    //       requestData = data
    //     }
    //   }

    //   return axios({
    //     url: this.getBaseUrl() + url,
    //     method: method,
    //     data: requestData,
    //     params: requestParams,
    //     crossDomain: true,
    //     responseType: dataType,
    //     withCredentials: true,
    //     headers: {
    //       'content-type': 'application/json; charset=utf-8',
    //       'Authorization': 'Bearer ' + this.getToken()
    //     }
    //   })
    //     .then(function (result) {
    //       var t = vm.$store.getters.token

    //       // Check if the token is still valid. Renew it if so.
    //       if (t && ((new Date().getTime() - new Date(t.createdOn).getTime()) <= t.lifetime)) {
    //         t.createdOn = new Date().getTime()
    //         vm.$store.dispatch('ON_TOKEN_CHANGED', t)
    //       }

    //       if (success) {
    //         success(result.data)
    //       }
    //     })
    //     .catch(function (err) {
    //       if (err.response) {
    //         // The request was made and the server responded with a status code that falls out of the range of 2xx
    //         // Log the user out if the result is forbidden and no error method has been provided
    //         // Otherwise, we assume that the calling method takes care of the error
    //         if (!error) {
    //           if (err.response.status === 403) {
    //             vm.$store.dispatch('ON_TOKEN_CHANGED', null)
    //             vm.$router.push('/gk/login')
    //           } else if (process.env.NODE_ENV === 'development') {
    //             console.error(err)
    //           }
    //         } else {
    //           error(err)
    //         }
    //       } else if (err.request) {
    //         // The request was made but no response was received `err.request` is an instance of XMLHttpRequest in the browser
    //         if (err.request.textStatus === 'timeout') {
    //           vm.$bvToast.toast('Request to the server timed out.', {
    //             title: 'Error',
    //             variant: 'danger',
    //             autoHideDelay: 5000,
    //             appendToast: true
    //           })
    //         }
    //       } else {
    //         // Something happened in setting up the request that triggered an Error
    //         if (process.env.NODE_ENV === 'development') {
    //           console.error(err)
    //         }
    //       }
    //     })
    // },
    unauthAjax ({ url = null, method = 'GET', data = null, dataType = 'json', success = null, error = null }) {
      var vm = this
      var requestData = null
      var requestParams = null

      // Stringify the data object for non-GET requests
      if (data !== null || data !== undefined) {
        if (method === 'GET') {
          requestParams = data
        } else {
          requestData = data
        }
      }

      return axios({
        url: this.getBaseUrl() + url,
        method: method,
        data: requestData,
        params: requestParams,
        crossDomain: true,
        responseType: dataType,
        headers: {
          'content-type': 'application/json; charset=utf-8'
        }
      })
        .then(function (result) {
          if (success) {
            success(result.data)
          }
        })
        .catch(function (err) {
          if (err.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx
            if (error) {
              error(err)
            } else if (process.env.NODE_ENV === 'development') {
              console.error(err)
            }
          } else if (err.request) {
            // The request was made but no response was received `err.request` is an instance of XMLHttpRequest in the browser
            if (err.request.textStatus === 'timeout') {
              vm.$bvToast.toast('Request to the server timed out.', {
                title: 'Error',
                variant: 'danger',
                autoHideDelay: 5000,
                appendToast: true
              })
            }
          } else {
            // Something happened in setting up the request that triggered an Error
            if (process.env.NODE_ENV === 'development') {
              console.error(err)
            }
          }
        })
    },
    getToken () {
      var t = this.$store.getters.token

      // Check if the token is still valid
      if (t && ((new Date().getTime() - new Date(t.createdOn).getTime()) > t.lifetime)) {
        t = null
        this.$store.dispatch('ON_TOKEN_CHANGED', t)
      }

      return t ? t.token : null
    }
  }
}
