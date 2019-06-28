<template>
  <v-server-table :url="baseUrl + 'user'"
                  :columns="columns"
                  :options="options"
                  ref="table"
                  v-on:row-click="onRowClicked($event)"
                  class="hover-select-table" />
</template>

<script>
export default {
  data: function () {
    return {
      user: null,
      columns: ['username', 'fullName', 'emailAddress', 'name', 'acronym', 'address'],
      options: {
        requestFunction: function (data) {
          var vm = this
          return this.apiGetUsers(data, function (result) {
            vm.dispatch('success', result)
          })
        },
        responseAdapter: function (data) {
          return data
        },
        rowClassCallback: (row) => {
          return (this.user && row.id === this.user.id) ? 'table-primary' : ''
        },
        perPage: 10,
        headings: {
          username: () => this.$t('tableColumnUsername'),
          fullName: () => this.$t('tableColumnFullName'),
          emailAddress: () => this.$t('tableColumnEmail'),
          name: () => this.$t('tableColumnInstituteName'),
          acronym: () => this.$t('tableColumnInstituteAcronym'),
          address: () => this.$t('tableColumnInstituteAddress')
        },
        sortable: ['username', 'fullName', 'emailAddress', 'name', 'acronym', 'address'],
        filterable: ['username', 'fullName', 'emailAddress', 'name', 'acronym', 'address']
      }
    }
  },
  props: {
    baseUrl: {
      type: String,
      required: true
    }
  },
  methods: {
    onRowClicked: function (event) {
      this.user = event.row

      this.$emit('user-selected', this.user)
    },
    refresh: function () {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style>
</style>
