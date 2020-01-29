<template>
  <b-container fluid class="mt-3">
    <b-row>
      <b-col cols=12>
        <h1>{{ $t('pageDatabasesHeading') }}</h1>
        <DatabaseTable v-on:database-selected="(database) => onDatabaseSelected(database)"/>
      </b-col>

      <b-col cols=12 v-if="database">
        <b-card header-tag="header" class="mb-3">
          <h6 slot="header" class="mb-0">{{ $t('pageUsersHeadingPermissions') }}</h6>
          <DatabasePermissionTable :database="database"
                                ref="permissionsTable" />
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import DatabaseTable from '../components/DatabaseTable'
import DatabasePermissionTable from '../components/DatabasePermissionTable'

export default {
  data: function () {
    return {
      database: null
    }
  },
  components: {
    DatabasePermissionTable,
    DatabaseTable
  },
  methods: {
    onDatabaseSelected: function (database) {
      this.database = database

      var vm = this
      this.$nextTick(function () {
        vm.$refs.permissionsTable.refresh()
      })
    }
  }
}
</script>

<style>

</style>
