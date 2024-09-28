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
          v-model="filter.type_id"
          :options="lookups.types"
          :label="$i18n.locale=='en'?'name':'name_local'"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="$t('Ticket Group')"
          :clearable="true"
        />
      </b-col>
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
      <b-col
        cols="12"
        md="4"
      >
        <v-select
          v-model="filter.user_type"
          :options="ticketUserTypes"
          :label="$i18n.locale=='en'?'name':'name_local'"
          class="w-100 mb-2"
          :reduce="(val) => val.type"
          :placeholder="$t('Global.Creator')"
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
        v-if="hasPermission('create_myTicket')"
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
            :to="{ name: 'ticket_show', params: { id: data.item.id } }"
          >
            {{ data.item.id }}
          </b-link>
        </template>
        <template #cell(subject)="data">
          <b-link
            :to="{ name: 'ticket_show', params: { id: data.item.id } }"
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
        <template #cell(user)="data">
          <b-badge
            variant="secondary"
          >
            {{ getTranslatedNameFromObject(getUserType(data.item.user.type)) }}
          </b-badge>
          <b-link
            :to="{ name: data.item.user.type == 3 ? 'student-show' :'user-show', params: { id: data.item.user.id } }"
          >
            {{ getTranslatedNameFromObject(data.item.user) }}
          </b-link>
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

const ticketApi = new TicketApi()

export default {
  name: 'Tickets',
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
      filter: { type_id: null, status: null, user_type: null },
      items: [],
      total: 0,
      lookup: [],
      load: false,
      paramsLoaded: true,
      ticketUserTypes: [
        {
          type: 'student',
          name: 'Student',
          name_local: 'طالب',
        },
        {
          type: 'instructor',
          name: 'Instructor',
          name_local: 'اعضاء هيئة تدريس',
        },
        {
          type: 'employee',
          name: 'Employee',
          name_local: 'موظفين',
        },
        {
          type: 'other',
          name: 'Other',
          name_local: 'الاخرين',
        },
      ],
    }
  },
  computed: {
    fields() {
      return [
        {
          key: 'id',
          label: this.$t('Ticket Id'),
          thStyle: { width: "7%" },
          sortable: true,
        },
        {
          key: 'user',
          label: this.$t('user'),
          thStyle: { width: "25%" },
        },
        {
          key: 'group',
          label: this.$t('Global.Ticket_Type'),
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
    refresh(query = null) {
      this.load = true
      ticketApi.list('support-tickets', query).then(response => {
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
    getColor(status){
      if(status.name == "New")
      {
        return 'info'
      }
      if(status.name == "Open")
      {
        return 'secondary'
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
      else if(status.name == "Incomplete")
      {
        return 'dark'
      }
    },
    getUserType(typeId) {
      let type = null
      switch (typeId) {
        case 1:
          type = {
            name: 'Instructor',
            name_local: 'اعضاء هيئة تدريس',
          }
          break
        case 2:
          type = {
            name: 'Employee',
            name_local: 'موظف',
          }
          break
        case 3:
          type = {
            name: 'Student',
            name_local: 'طالب',
          }
          break
        default:
          type = {
            name: 'unknown',
            name_local: 'غير معرف',
          }
          break
      }

      return type
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
