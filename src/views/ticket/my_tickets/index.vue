<template>
  <DataTable
    :total="total"
    :filter="filter"
    :loading="load"
    :params-loaded="paramsLoaded"
    @Refresh="refresh"
    @reset="reset"
  >
    <template
      v-if="lookups"
      #filter
    >
      <b-col
        cols="12"
        md="4"
      >
        <v-select
          v-model="filter.status"
          :options="lookups.statusList"
          :label="$i18n.locale=='en'?'name':'name_local'"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.status')"
          :clearable="true"
        />
      </b-col>
    </template>
    <template #action>
      <b-button
        v-b-tooltip.hover="$t('Global.add')"
        class="btn-icon"
        variant="primary"
        @click="$router.push({ name: 'add_ticket' })"
      >
        <feather-icon icon="PlusIcon" />
      </b-button>

    </template>
    <template #customTable>
      <b-table
        class="position-relative"
        :items="items"
        responsive
        :fields="fields"
        primary-key="id"
        show-empty
        :empty-text="$t('Global.empty_text')"
      >
        <template #cell(id)="data">
          <b-link
            :to="{ name: 'my_ticket_show', params: { id: data.item.id } }"
          >
            {{ data.item.id }}
          </b-link>
        </template>
        <template #cell(subject)="data">
          <b-link
            :to="{ name: 'my_ticket_show', params: { id: data.item.id } }"
          >
            {{ data.item.subject }}
          </b-link>
        </template>
<!--        <template #cell(description)="data">-->
<!--          {{ data.item.description.substr(0,30) }}-->
<!--        </template>-->
        <template #cell(group)="data">
          {{ getTranslatedNameFromObject(data.item.group) }}
        </template>
        <template #cell(status)="data">
          <b-badge
            v-if="status = getTicketStatusBadge(data.item.status)"
            :variant="getColor(data.item.status)"
          >
            {{ status.label }}
          </b-badge>
        </template>
      </b-table>
    </template>
  </DataTable>
</template>
<script>
import {
  VBModal,
  BTable,
  BBadge,
  BCol,
  BLink,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import DataTable from '@/views/components/table/DataTable'

import TicketApi from '@/api/system/ticket.js'
import { mapActions } from 'vuex'

const ticketApi = new TicketApi()

export default {
  name: 'MyTickets',
  components: {
    DataTable,
    BTable,
    vSelect,
    BBadge,
    BCol,
    BLink,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  data() {
    return {
      filter: { status: null },
      items: [],
      total: 0,
      lookup: [],
      load: false,
      paramsLoaded: true,
    }
  },
  computed: {
    fields() {
      return [
        {
          key: 'id',
          label: this.$t('Ticket Id'),
          sortable: true,
        },
        {
          key: 'subject',
          label: this.$t('Subject'),
        },
        // {
        //   key: 'description',
        //   label: this.$t('Description'),
        // },
        {
          key: 'group',
          label: this.$t('Global.Ticket_Type'),
        },
        {
          key: 'created_at',
          label: this.$t('created_at'),
        },
        {
          key: 'status',
          label: this.$t('Status'),
        },
        {
          key: 'messages_count',
          label: this.$t('Messages'),
          sortable: true,
        },
        // {
        //   key: 'action',
        //   label: this.$t('actions'),
        // }
      ]
    },
    lookups() {
      return this.lookup
    },
  },
  watch: {
  },
  methods: {
    ...mapActions({
      getLookup: 'app/GET_LOOKUPS',
    }),
    getColor(status){
      if(status.name == "New")
      {
        return 'info'
      }
      else if(status.name == "Open")
      {
        return 'secondary'
      }
      else if(status.name == "Incomplete")
      {
        return 'dark'
      }
      else if(status.name == "Re-Open")
      {
        return 'warning'
      }
      else if(status.name == "Postponed")
      {
        return 'danger'
      }
      else if(status.name == "Resolved")
      {
        return 'success'
      }
    },
    refresh(query = null) {
      this.load = true
      ticketApi.list('my-tickets', query).then(response => {
        this.items = response.data
        this.total = response.meta.count
        this.lookup = response.meta.lookup
        this.load = false
      }).then(() => {
        this.paramsLoaded = false
      }).catch(error => {
        this.load = false
      })
    },
    reset() {
      let terms = [
        "term_id",
        "admission_term_id",
        "admission_term_PG_id",
        "admission_term_UG_id",
        "control_term_id",
        "exam_term_id",
        "transfer_term_id",
      ];
      let query = { ...this.$route.query, ...{} };
      let currentTerm = terms.find((el) => {
        return Object.keys(query).some((qu) => {
          return el == qu;
        });
      });
      Object.keys(query).forEach((key) => {
        if (key != currentTerm && key != "removed" && key != "export") {
          this.filter[key] = null;
        }
      });
      this.resetFilterQueryParams(terms);
    },
  },

}
</script>
