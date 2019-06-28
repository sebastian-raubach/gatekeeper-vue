<template>
  <b-container fluid>
    <h1>{{ $t('pageRequestsHeading') }}</h1>

    <template v-if="(newRequestData && newRequestData.length > 0) || (existingRequestData && existingRequestData.length > 0)">
      <template v-if="newRequestData && newRequestData.length > 0">
        <h2>{{ $t('pageRequestsHeadingNew') }}</h2>
        <UserRequestTable :data="newRequestData"
                          requestType="new" />
      </template>

      <template v-if="existingRequestData && existingRequestData.length > 0">
        <h2>{{ $t('pageRequestsHeadingExisting') }}</h2>
        <UserRequestTable :data="existingRequestData"
                          requestType="existing" />
      </template>
    </template>
    <h3 v-else>{{ $t('genericHeadingNoData') }}</h3>
  </b-container>
</template>

<script>
import UserRequestTable from '../components/UserRequestTable'

export default {
  data: function () {
    return {
      newRequestData: [],
      existingRequestData: []
    }
  },
  components: {
    UserRequestTable
  },
  mounted: function () {
    var vm = this

    this.apiGetNewRequests(function (result) {
      vm.newRequestData = result
    })
    this.apiGetExistingRequests(function (result) {
      vm.existingRequestData = result
    })
  }
}
</script>

<style>
</style>
