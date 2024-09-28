<template>
  <b-row>
    <b-col cols="12">
      <b-overlay
        :show="refresh"
        rounded="sm"
        no-fade
      >
        <b-card
          :title="$t('Ticket Details')"
          tag="article"
          style="max-width: 100%; text-transform: capitalize;"
          class="mb-2"
        >
          <b-card-header
            v-if="!refresh"
            style="padding: 0 !important; margin-bottom: 6%"
            class="mb-2"
          >
            <b-col
              class="col-4"
              style="font-size: 14px"
            >
              <h4 />
            </b-col>

          </b-card-header>
          <b-card-body
            v-if="ticket"
            style="padding: 0 !important;"
          >
            <list
              :data="ticket"
              :only="[]"
            >
              <template #custom_show>
                <tr>
                  <th
                    scope="row"
                    :width="'40%'"
                  >
                    {{ $t('Ticket Id') }}
                  </th>
                  <td
                    class="d-flex flex-wrap"
                  >
                    <span>
                      {{ ticket.id }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    :width="'40%'"
                  >
                    {{ $t('created_at') }}
                  </th>
                  <td
                    class="d-flex flex-wrap"
                  >
                    <span>
                      {{ ticket.created_at }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    :width="'40%'"
                  >
                    {{ $t('Status') }}
                  </th>
                  <td
                    class="d-flex flex-wrap"
                  >
                    <b-badge
                      v-if="status = getTicketStatusBadge(ticket.status)"
                      :variant="getColor(ticket.status)"
                    >
                      {{ status.label }}
                    </b-badge>
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    :width="'40%'"
                  >
                    {{ $t('Subject') }}
                  </th>
                  <td
                    class="d-flex flex-wrap"
                  >
                    <span>
                      {{ ticket.subject }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    :width="'40%'"
                  >
                    {{ $t('Description') }}
                  </th>
                  <td
                    class="d-flex flex-wrap"
                  >
                    <span>
                      {{ ticket.description }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    :width="'40%'"
                  >
                    {{ $t('Ticket Type') }}
                  </th>
                  <td
                    class="d-flex flex-wrap"
                  >
                    <span>
                      {{ getTranslatedNameFromObject(ticket.group) }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    :width="'40%'"
                  >
                    {{ $t('Attachment Files') }}
                  </th>
                  <td
                    class="d-flex flex-wrap"
                  >
                    <div
                      class="files-content"
                    >
                      <a
                        v-for="(file,i) in ticket.attachments"
                        :key="i"
                        class="link-file"
                        :href="file.url"
                        target="_blank"
                      >
                        <div class="other-file">
                          <span :class="'file-type ' + getFileTypeClass(file.extension)"> {{ file.extension }} </span>
                          <div class="file-info">
                            <span class="file-name"> {{ file.name ? file.name : ' - ' }} </span>
                            <span class="file-details">{{ file.size }} KB, {{ $t(getFileTypeClass(file.extension)) }}</span>
                          </div>
                        </div>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    :width="'40%'"
                  >
                    {{ $t('Chat') }}
                  </th>
                  <td
                    class="d-flex flex-wrap"
                  >
                    <b-link
                      class="btn btn-outline-primary chat-btn"
                      :to="{ name: 'ticket_chat', params:{'chat_id': ticket.chat_id} }"
                    >
                      {{ $t('Open Chat') }}
                      <b-badge
                        v-if="ticket.messages_count"
                        variant="danger"
                      >
                        {{ ticket.messages_count }}
                      </b-badge>
                    </b-link>
                  </td>
                </tr>
              </template>
            </list>
          </b-card-body>
        </b-card>
      </b-overlay>
    </b-col>
  </b-row>
</template>

<script>

import {
  BCard, BCol, BRow, BLink, BBadge, BButton, BOverlay,
} from 'bootstrap-vue'
import List from '@/views/components/info/list'
import TicketApi from '@/api/system/ticket'

const ticketApi = new TicketApi()

export default {
  name: 'Show',
  components: {
    BCard, BCol, BRow, BLink, List, BBadge, BButton, BOverlay,
  },
  data() {
    return {
      ticket: null,
      refresh: false,
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
  },
  watch: {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.refresh = true
      ticketApi.get(this.id).then(data => {
        this.ticket = data.data
        this.refresh = false
        this.$store.commit('app/UPDATE_PAGE_DETAILS', { name: this.ticket.subject, name_name: this.ticket.subject }, { root: true })
      })
    },
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
  },
}

</script>

<style lang="scss">

@import "@/views/chat/chat/components/custom-chat-style.scss";

.files-content .link-file{
  display: inline-block;
  text-align: center;
  margin-right: 10px;
}

.files-content .link-file div{
  display: inline-block;
  max-width: 500px;
  max-height: 200px;
  width: 100%;
  overflow-wrap: break-word;
  border-radius: 5px;
  padding: 3px 9px;
  font-size: 1.1em;
  margin-bottom: 5px;
  position: relative;
  background: #f1f1f1;
  color: black;
}

.files-content .link-file .file-type{
  display: inline-block;
  background: red;
  position: absolute;
  z-index: 100;
  top: 0px;
  left: 0px;
  bottom: 0px;
  width: 60px;
  text-transform: uppercase;
  font-weight: bold;
  line-height: 3.8em;
  color: white;
}

.files-content .link-file .file-info{
  display: inline-block;
  padding-left: 60px;
}

.file-info .file-name{
  display: block;
  font-size: 15px;
  font-weight: bold;
  text-align: start;
}

.file-info .file-details{
  display: block;
  font-size: 12px;
  text-align: start;
}

.chat-left .link-file div{
  background: #f1f1f1 !important;
  color: black !important;
}

.chat-btn{
  position: relative;
}

.chat-btn .badge {
  position: absolute;
  top: -10px;
  right: -7px;
  left: unset;
  border-radius: 10px;
}

</style>
