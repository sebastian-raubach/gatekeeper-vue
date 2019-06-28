<template>
  <v-client-table :data="data"
                  :columns="columns"
                  :options="options"
                  ref="table" >
      <span slot="createdOn"
            slot-scope="props">
        {{ props.row.createdOn | toDate }}
      </span>
      <b-button-group slot="actions" slot-scope="props">
        <b-button size="sm"
                  v-b-tooltip.hover
                  variant="secondary"
                  :title="$t('actionDelete')"
                  @click="onAction('delete', props.row)">
          <DeleteIcon :title="$t('actionDelete')" />
        </b-button>
        <b-button size="sm"
                  v-b-tooltip.hover
                  variant="danger"
                  :title="$t('actionReject')"
                  @click="onAction('reject', props.row)">
          <ThumbDownIcon :title="$t('actionReject')" />
        </b-button>
        <b-button size="sm"
                  v-b-tooltip.hover
                  variant="success"
                  :title="$t('actionAccept')"
                  @click="onAction('approve', props.row)">
          <ThumbUpIcon :title="$t('actionAccept')" />
        </b-button>
      </b-button-group>
    </v-client-table>
</template>

<script>
import DeleteIcon from 'vue-material-design-icons/Delete'
import ThumbDownIcon from 'vue-material-design-icons/ThumbDown'
import ThumbUpIcon from 'vue-material-design-icons/ThumbUp'

export default {
  data: function () {
    return {
      columns: ['username', 'fullName', 'emailAddress', 'name', 'acronym', 'address', 'databaseSystemName', 'databaseServerName', 'createdOn', 'actions'],
      options: {
        perPage: 10,
        headings: {
          username: () => this.$t('tableColumnUsername'),
          fullName: () => this.$t('tableColumnFullName'),
          emailAddress: () => this.$t('tableColumnEmail'),
          name: () => this.$t('tableColumnInstituteName'),
          acronym: () => this.$t('tableColumnInstituteAcronym'),
          address: () => this.$t('tableColumnInstituteAddress'),
          databaseSystemName: () => this.$t('tableColumnRequestsAccessTo'),
          databaseServerName: () => this.$t('tableColumnRequestsOnServer'),
          createdOn: this.$t('tableColumnRequestsOnDate'),
          actions: ''
        },
        sortable: ['username', 'fullName', 'emailAddress', 'name', 'acronym', 'address', 'databaseSystemName', 'databaseServerName', 'createdOn'],
        filterable: ['username', 'fullName', 'emailAddress', 'name', 'acronym', 'address', 'databaseSystemName', 'databaseServerName', 'createdOn']
      }
    }
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    requestType: {
      type: String,
      required: true,
      validator: (val) => ['new', 'existing'].includes(val)
    }
  },
  components: {
    DeleteIcon,
    ThumbDownIcon,
    ThumbUpIcon
  },
  methods: {
    onAction: function (decision, row) {
      if (this.requestType === 'new') {
        this.onActionNew(decision, row)
      } else if (this.requestType === 'existing') {
        this.onActionExisting(decision, row)
      }
    },
    refresh: function () {
      this.$refs.table.refresh()
    },
    onActionExisting: function (decision, row) {
      switch (decision) {
        case 'delete':
          break
        case 'reject':
          break
        case 'approve':
          break
      }
    },
    onActionNew: function (decision, row) {
      switch (decision) {
        case 'delete':
          break
        case 'reject':
          break
        case 'approve':
          break
      }
    }
  }
}
</script>

<style>
</style>
