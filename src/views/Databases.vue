<template>
  <b-container fluid>
    <b-row>
      <b-col xs=12>
        <h1>Databases</h1>
        <DatabaseTable :baseUrl="baseUrl" />
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
  props: [ 'baseUrl' ],
  components: {
    DatabaseTable
  }
}
</script>

<style>

</style>
