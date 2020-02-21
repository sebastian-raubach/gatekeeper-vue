<template>
  <div>
    <v-client-table :data="data"
                    :columns="columns"
                    :options="options"
                    ref="table" >
      <span slot="createdOn"
            slot-scope="props">
        {{ props.row.createdOn | toDate }}
      </span>
      <div slot="activationKey" slot-scope="props">
        <span v-b-tooltip:hover :title="$t('tooltipEmailActivationAwaiting')" v-if="props.row.activationKey && props.row.activationKey.length > 0">
          <TimerSandIcon class="text-danger" />
        </span>
        <span v-b-tooltip:hover :title="$t('tooltipEmailActivationSuccessful')" v-else>
          <EmailCheckOutlineIcon class="text-success" />
        </span>
      </div>
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
    <b-modal ref="feedbackModal" @ok="onReject(null)" :ok-title="$t('actionReject')" ok-variant="danger" :cancel-title="$t('actionCancel')" :title="$t('modalTitleRejection')" v-if="currentRow">
      <b-form @submit.prevent="onReject(null)">
        <b-textarea rows="5" :placeholder="$t('modalTextRejection')" v-model="rejectionReason" />
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import DeleteIcon from 'vue-material-design-icons/Delete'
import ThumbDownIcon from 'vue-material-design-icons/ThumbDown'
import ThumbUpIcon from 'vue-material-design-icons/ThumbUp'
import EmailCheckOutlineIcon from 'vue-material-design-icons/EmailCheckOutline'
import TimerSandIcon from 'vue-material-design-icons/TimerSand'
import I18nTable from './I18nTable'
import { EventBus } from '../event-bus.js'

export default {
  extends: I18nTable,
  data: function () {
    return {
      columns: ['username', 'fullName', 'emailAddress', 'name', 'acronym', 'address', 'databaseSystemName', 'databaseServerName', 'activationKey', 'createdOn', 'actions'],
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
          activationKey: () => this.$t('tableColumnRequestsActivationKey'),
          createdOn: this.$t('tableColumnRequestsOnDate'),
          actions: ''
        },
        columnsClasses: {
          actions: 'py-0 align-middle'
        },
        sortable: ['username', 'fullName', 'emailAddress', 'name', 'acronym', 'address', 'databaseSystemName', 'databaseServerName', 'activationKey', 'createdOn'],
        filterable: ['username', 'fullName', 'emailAddress', 'name', 'acronym', 'address', 'databaseSystemName', 'databaseServerName', 'activationKey', 'createdOn']
      },
      currentRow: null,
      rejectionReason: null
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
    EmailCheckOutlineIcon,
    ThumbDownIcon,
    ThumbUpIcon,
    TimerSandIcon
  },
  methods: {
    onAction: function (decision, row) {
      switch (decision) {
        case 'delete':
          this.onDelete(row)
          break
        case 'reject':
          this.onReject(row)
          break
        case 'approve':
          this.onApprove(row)
          break
      }
    },
    onReject: function (row) {
      if (row) {
        this.currentRow = row
        this.$nextTick(() => this.$refs.feedbackModal.show())
      } else {
        EventBus.$emit('show-loading', true)
        var decision = {
          requestId: this.currentRow.id,
          decision: 'REJECT',
          feedback: this.rejectionReason
        }

        if (this.requestType === 'new') {
          this.apiPostDecisionNewRequests(this.currentRow.id, decision, result => {
            this.refresh()
            EventBus.$emit('show-loading', false)
          })
        } else if (this.requestType === 'existing') {
          this.apiPostDecisionExistingRequests(this.currentRow.id, decision, result => {
            this.refresh()
            EventBus.$emit('show-loading', false)
          })
        }
        this.currentRow = null
      }

      this.rejectionReason = null
    },
    onApprove: function (row) {
      EventBus.$emit('show-loading', true)
      this.$bvModal.msgBoxConfirm(this.$t('modalMessageSure'), {
        okTitle: this.$t('genericYes'),
        okVariant: 'danger',
        cancelTitle: this.$t('genericNo')
      })
        .then(value => {
          if (value) {
            var decision = {
              requestId: row.id,
              decision: 'APPROVE'
            }

            if (this.requestType === 'new') {
              this.apiPostDecisionNewRequests(row.id, decision, result => {
                this.refresh()
                EventBus.$emit('show-loading', false)
              })
            } else if (this.requestType === 'existing') {
              this.apiPostDecisionExistingRequests(row.id, decision, result => {
                this.refresh()
                EventBus.$emit('show-loading', false)
              })
            }
          }
        })
    },
    onDelete: function (row) {
      EventBus.$emit('show-loading', true)
      this.$bvModal.msgBoxConfirm(this.$t('modalMessageSure'), {
        okTitle: this.$t('genericYes'),
        okVariant: 'danger',
        cancelTitle: this.$t('genericNo')
      })
        .then(value => {
          if (value) {
            if (this.requestType === 'new') {
              this.apiDeleteRequestNew(row.id, result => {
                this.refresh()
                EventBus.$emit('show-loading', false)
              })
            } else if (this.requestType === 'existing') {
              this.apiDeleteRequestExisting(row.id, result => {
                this.refresh()
                EventBus.$emit('show-loading', false)
              })
            }
          }
        })
    },
    refresh: function () {
      this.$emit('request-data')
    }
  }
}
</script>

<style>
</style>
