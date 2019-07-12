<template>
  <b-container class="mt-3">
    <h1>{{ $t('pageActivationTitle') }}</h1>
    <h5 v-if="!activationKey" class="text-danger">{{ $t('errorMessageNoActivationKey') }}</h5>
    <div v-else>
      <div class="text-center" v-if="!decision">
        <b-spinner class="m-5" variant="info" :label="$t('paginationLoading')"></b-spinner>
      </div>
      <h5 v-else :class="variant">
        {{ getText() }}
      </h5>
    </div>
  </b-container>
</template>

<script>
export default {
  data: function () {
    return {
      activationKey: null,
      decision: null,
      variant: ''
    }
  },
  methods: {
    getText: function () {
      switch (this.decision) {
        case 'UNKOWN_ERROR':
        case 'ERROR':
          this.variant = 'text-danger'
          return this.$t('errorMessageUnknownServerError')
        case 'NOT_FOUND':
          this.variant = 'text-danger'
          return this.$t('errorMessageActivationInvalidKey')
        case 'AWAITS_APPROVAL':
          this.variant = 'text-info'
          return this.$t('pageActivationMessageSuccessfulAwaitingApproval')
        case 'GRANTED':
          this.variant = 'text-success'
          return this.$t('pageActivationMessageSuccessfulLetsGo')
      }
    }
  },
  mounted: function () {
    var vm = this
    this.activationKey = this.$route.query.activationKey

    if (this.activationKey) {
      this.apiPostActivationRequest(this.activationKey, function (result) {
        vm.decision = result
      }, {
        codes: [],
        callback: function (error) {
          if (error.request && error.request.status === 404) {
            vm.decision = 'NOT_FOUND'
          } else if (error.request.response) {
            vm.decision = error.request.response.description
          } else {
            vm.decision = 'UKNOWN_ERROR'
          }
        }
      })
    }
  }
}
</script>

<style>

</style>
