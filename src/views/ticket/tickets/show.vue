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
          <div class="custom_actions">
            <b-dropdown
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              :text="$t('Global.more')"
              right
              size="sm"
              variant="outline-primary"
              v-if="hasPermission('update_status_ticket') || hasPermission('change_group_ticket')"
            >
              <b-dropdown-item @click="switchModal">
                {{ $t('update_status') }}
              </b-dropdown-item>
              <b-dropdown-item @click="switchGroup">
                {{ $t('change_group') }}
              </b-dropdown-item>
            </b-dropdown>
          </div>
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
                    {{ $t('user') }}
                  </th>
                  <td
                    class="d-flex flex-wrap"
                  >
                    <b-badge
                      variant="secondary"
                    >
                      {{ getTranslatedNameFromObject(getUserType(ticket.user.type)) }}
                    </b-badge>
                    <b-link
                      style="margin: 0 5px"
                      :to="{ name: ticket.user.type == 3 ? 'student-show' :'user-show', params: { id: ticket.user.id } }"
                    >
                      {{ ticket.user.code }}:{{ getTranslatedNameFromObject(ticket.user) }}
                    </b-link>
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
                <tr v-if="hasPermission('open_chat_ticket')">
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
        <b-card
          :title="$t('Ticket History')"
          tag="article"
          style="max-width: 100%; text-transform: capitalize;"
          class="mb-2"
          v-if="hasPermission('show_history_ticket')"
        >
          <b-card-body
            v-if="ticket"
            style="padding: 0 !important;"
          >
            <ticket-history ref="ticketHistoryRef" :ticketId="id" />
          </b-card-body>
        </b-card>
      </b-overlay>
    </b-col>
     <!-- :cancel-title="$t('Cancel')"
        :ok-title="$t('Global.ok')" -->
        <!-- @ok="submitNewStatusBTN" -->
    <div class="all-modals">
      <!-- modal -->
      <b-modal
        id="my-modal"
        ref="my-modal"
        v-model="show_modal"
        size="lg"
        :title="$t('update status')"
        hide-footer
        cancel-variant="outline-secondary"
        no-close-on-backdrop
        @ok="submitNewStatusBTN"
        @show="changeStatusModalOpened"
        v-if="hasPermission('update_status_ticket')"
      >
      <div class="col-md-12 col-12">
        <validation-observer ref="fromRules">
          <b-form
            ref="formUpdateStatus"
            @submit.stop.prevent="submitNewStatus"
          >
            <b-form-group
              :label="$t('please_select_status')"
              label-for="mc-sections"
            >
              <validation-provider
                #default="{ errors }"
                name="status"
                rules="required"
              >
                <v-select
                  id="mc-sections"
                  v-model="changeStatusForm.status"
                  :options="newStatusOptions"
                  class="w-100"
                  :reduce="val => val.id"
                  required
                  :label="$i18n.locale=='en'?'name':'name_local'"
                  :selectable="status => status.id != ticket.status.id"
                />
                <ValidationErrors :frontend-errors="errors" />
              </validation-provider>
            </b-form-group>
            <b-form-group
              :label="$t('feedback')"
              label-for="desc-input"
            >
              <validation-provider
                #default="{ errors }"
                name="feedback"
                rules="required"
              >
                <b-form-textarea
                  v-model="changeStatusForm.feedback"
                  required
                />
                <ValidationErrors :frontend-errors="errors" />
              </validation-provider>
            </b-form-group>
          </b-form>
        </validation-observer>
      </div>
        <div class="mt-0">
          <b-col cols="12" md="12">
            <div class="d-flex justify-content-end">
              <b-button type="submit" variant="primary" class="mr-1" :disabled="showBtn" @click="submitNewStatusBTN">
                {{ $t('Global.send') }}
                <b-spinner
                    v-if="showBtn"
                    small
                    :label="$t('Global.loading')"
                ></b-spinner>
              </b-button>
              <b-button type="reset" variant="outline-primary" @click="switchModal">
                {{ $t('Global.cancel') }}
              </b-button>
            </div>
          </b-col>
        </div>
      </b-modal>
      <b-modal
        id="change-group-modal"
        ref="change-group-modal"
        size="lg"
        hide-footer
        :title="$t('Global.Change Assigned Group')"
        :ok-title="$t('Global.ok')"
        :cancel-title="$t('Cancel')"
        cancel-variant="outline-secondary"
        v-model="show_group"
        no-close-on-backdrop
        @ok="submitChangeGroupBTN"
        @show="changeGroupModalOpened"
        v-if="hasPermission('change_group_ticket')"
      >
        <validation-observer ref="change_group_form_rules">
          <b-form
            ref="formChangeAssign"
            @submit.stop.prevent="submitChangeGroup"
          >
            <b-form-group
              :label="$t('please_select_new_group')"
              label-for="mc-sections"
            >
              <validation-provider
                #default="{ errors }"
                rules="required"
              >
                <v-select
                  v-model="changeGroupForm.groupId"
                  :options="newGroupsOptions"
                  class="w-100"
                  :reduce="val => val.id"
                  required
                  :label="$i18n.locale=='en'?'name':'name_local'"
                  :selectable="group => group.id != ticket.group.id"
                />
                <ValidationErrors :frontend-errors="errors" />
              </validation-provider>
            </b-form-group>
            <b-form-group
              :label="$t('feedback')"
              label-for="desc-input"
            >
              <validation-provider
                #default="{ errors }"
                name="feedback"
                rules="required"
              >
                <b-form-textarea
                  v-model="changeGroupForm.feedback"
                  required
                />
                <ValidationErrors :frontend-errors="errors" />
              </validation-provider>
            </b-form-group>
          </b-form>
        </validation-observer>
        <div class="mt-0">
          <b-col cols="12" md="12">
            <div class="d-flex justify-content-end">
              <b-button type="submit" variant="primary" class="mr-1" :disabled="showBtn" @click="submitChangeGroupBTN">
                {{ $t('Global.send') }}
                <b-spinner
                    v-if="showBtn"
                    small
                    :label="$t('Global.loading')"
                ></b-spinner>
              </b-button>
              <b-button type="reset" variant="outline-primary" @click="switchGroup">
                {{ $t('Global.cancel') }}
              </b-button>
            </div>
          </b-col>
        </div>
      </b-modal>
    </div>
  </b-row>
</template>

<script>

import {
  BCard, BCol, BRow, BLink, BBadge, BButton, BDropdown, BDropdownItem, BModal, BFormGroup, BFormTextarea, BForm, BCardBody, BOverlay,
} from 'bootstrap-vue'
import List from '@/views/components/info/list'
import TicketApi from '@/api/system/ticket'
import { mapActions } from 'vuex'
import vSelect from 'vue-select'
import ValidationErrors from '@/views/components/common/ValidationErrors'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { required } from '@validations'
import TicketHistory from '../components/TicketHistory'

const ticketApi = new TicketApi()

export default {
  name: 'Show',
  components: {
    BCard,
    BCol,
    BRow,
    BLink,
    List,
    BBadge,
    BButton,
    BDropdown,
    BDropdownItem,
    BModal,
    vSelect,
    BFormGroup,
    BFormTextarea,
    ValidationErrors,
    ValidationProvider,
    ValidationObserver,
    BForm,
    BCardBody,
    BOverlay,
    TicketHistory,
  },
  data() {
    return {
      show_modal:false,
      show_group:false,
      ticket: null,
      refresh: false,
      changeStatusForm: {
        feedback: null,
        status: null,
      },
      changeGroupForm: {
        feedback: null,
        groupId: null,
      },
      newStatusOptions: [],
      newGroupsOptions: [],
      updateStatusLoad: false,
      updateGroupLoad: false,
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
    ...mapActions({
      getLookup: 'app/GET_LOOKUPS',
    }),
    switchModal(){
      this.show_modal=!this.show_modal;
    },
    switchGroup(){
      this.show_group=!this.show_group;
    },
    init() {
      this.refresh = true
      ticketApi.get(this.id).then(data => {
        this.ticket = data.data
        this.refresh = false
        this.$store.commit('app/UPDATE_PAGE_DETAILS', { name: this.ticket.subject, name_name: this.ticket.subject }, { root: true })
      })
      this.getLookup({ ticket_status: true }).then(response => {
        this.newStatusOptions = response.success.status
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
    submitNewStatus() {
      // to check if no error
      this.$refs.fromRules.validate().then(success => {
        if (success) {
          this.updateStatusload = true

          const payload = {
            id: this.id,
            query: this.changeStatusForm,
          }
          // to send form data with files
          ticketApi.updateStatus(payload).then(response => {
            this.$nextTick(() => {
              this.$refs['my-modal'].toggle('#toggle-btn')
            })
            this.successToast(this.$t('status_changed'))
            this.refreshData()
          }).catch(error => {
          }).finally(_ => {
            this.updateStatusLoad = false
          })
        } else {
          this.errorToast(this.$t('must_select_error'))
        }
      })
    },
    submitNewStatusBTN(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      this.submitNewStatus()
    },
    submitChangeGroup() {
      // to check if no error
      this.$refs.change_group_form_rules.validate().then(success => {
        if (success) {
          this.updateGroupLoad = true

          const payload = {
            id: this.id,
            query: this.changeGroupForm,
          }
          // to send form data with files
          ticketApi.updateGroup(payload).then(response => {
            this.$nextTick(() => {
              this.$refs['change-group-modal'].toggle('#toggle-btn')
            })
            this.successToast(this.$t('group_changed'))
            this.$router.replace({name:"tickets"}).catch(()=>{})
            this.refreshData()
          }).catch(error => {
          }).finally(_ => {
            this.updateGroupLoad = false
          })
        } else {
          this.errorToast(this.$t('must_select_error'))
        }
      })
    },
    submitChangeGroupBTN(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      this.submitChangeGroup()
    },
    changeGroupModalOpened(){
      this.getLookup({ ticket_types: true }).then(response => {
        this.newGroupsOptions = response.success.ticketTypes
      })
    },
    changeStatusModalOpened(){
      this.getLookup({ ticket_status: true }).then(response => {
        this.newStatusOptions = response.success.status
      })
    },
    refreshData(){
      this.init()
      this.$refs.ticketHistoryRef.init();
    }
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
