<template>
  <b-container fluid class="mt-3">
    <b-row>
      <b-col xs=12>
        <h1>{{ $t('pageDatabasesHeading') }}</h1>
        <DatabaseTable />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import DatabaseTable from '../components/DatabaseTable'

export default {
  data: function () {
    return {
    }
  },
  components: {
    DatabaseTable
  }
}
</script>

<style>

</style>
