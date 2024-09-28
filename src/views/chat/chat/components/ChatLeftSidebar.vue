<template>
  <div class="sidebar-left">
    <div class="sidebar">

      <!-- Logged In User Profile Sidebar -->
      <user-profile-sidebar
        :shall-show-user-profile-sidebar="shallShowUserProfileSidebar"
        :profile-user-data="profileUserData"
        @close-sidebar="$emit('update:shall-show-user-profile-sidebar', false)"
      />

      <!-- Sidebar Content -->
      <div
        class="sidebar-content"
        :class="{'show': mqShallShowLeftSidebar}"
      >

        <!-- Sidebar close icon -->
        <span class="sidebar-close-icon">
          <feather-icon
            icon="XIcon"
            size="16"
            @click="$emit('update:mq-shall-show-left-sidebar', false)"
          />
        </span>

        <!-- Header -->
        <div class="chat-fixed-search">
          <div class="d-flex align-items-center w-100">
            <div class="sidebar-profile-toggle">
              <b-avatar
                size="42"
                class="cursor-pointer badge-minimal avatar-border-2"
                :src="profileUserMinimalData.avatar"
                variant="transparent"
                badge
                badge-variant="success"
                @click.native="$emit('show-user-profile')"
              />
            </div>
            <!-- Search -->
            <b-input-group class="input-group-merge ml-1 w-100 round">
              <b-input-group-prepend is-text>
                <feather-icon
                  icon="SearchIcon"
                  class="text-muted"
                />
              </b-input-group-prepend>
              <b-form-input
                v-model="searchQuery"
                :placeholder="$t('Search')"
              />
            </b-input-group>
            <feather-icon
              icon="PlusIcon"
              size="25"
              class="ml-1"
              @click="openContactModal"
            />
          </div>
        </div>

        <!-- ScrollArea: Chat & Contacts -->
        <vue-perfect-scrollbar
          auto-update
          :settings="perfectScrollbarSettings"
          class="chat-user-list-wrapper list-group scroll-area"
        >
          
          <!-- Chats Title -->
          <h4 class="chat-list-title"  @click="toggleChats">
            {{ $t('Chats') }}
            <feather-icon v-if="showChat"
            icon="ArrowDownIcon"
            size="20"
            class="arrow"
            />
            <feather-icon v-else
            icon="ArrowRightIcon"
            class="arrow"
            size="20"
            />  
          </h4>

          <!-- Chats -->
          <ul class="chat-users-list chat-list media-list" v-show="showChat" ref="contactList">
            <chat-contact
              v-for="contact in filteredChatsContacts"
              :key="contact.id"
              :user="contact"
              tag="li"
              :class="{'active': activeChatContactId === contact.id}"
              is-chat-contact
              @click="$emit('open-chat', contact.id,contact.chat.id)"
            />
          </ul>

          <!-- Contacts Title -->
          <div>
          <h4 class="chat-list-title" @click="toggleContacts" v-if="filteredContacts.length!=0">
            {{ $t('Advised Students') }}
            <feather-icon v-if="showContact"
            icon="ArrowDownIcon"
            size="20"
            class="arrow"
            />
            <feather-icon v-else
            icon="ArrowRightIcon"
            class="arrow"
            size="20"
            />  
          </h4>
        
        
          
        </div>
          <!-- Contacts -->
          <ul class="chat-users-list contact-list media-list" v-show="showContact" ref="contactList">
            <chat-contact
              v-for="contact in filteredContacts"
              :key="contact.id"
              :user="contact"
              :class="{'active': activeChatContactId === contact.id}"
              tag="li"
              @click="$emit('open-chat', contact.id,contact.chat.id)"
            />
          </ul>
        </vue-perfect-scrollbar>
      </div>
    </div>
    <b-modal
      id="add-contact-modal"
      v-model="showAddContactModal"
      :title="$t('Add Contact')"
      no-close-on-backdrop
      hide-footer
      size="lg"
    >
      <div class="mb-1">
        <b-form-group
          :label="$t('User Name')"
          label-for="code-input"
        >
          <validation-provider
            #default="{ errors }"
            rules="required"
          >
            <v-select
              v-model="contactUser"
              :dir="$i18n.locale=='en' ? 'ltr' : 'rtl'"
              @search="fetchUsers"
              :options="searchedUsersOptions"
              :filterable="false"
              :reduce="(val) => val.id"
              :label="$i18n.locale=='en'?'name':'name_local'"
              :selectable=" val => !val.header"
            >
              <template slot="no-options">
                {{$t('type_to_search')}}
              </template>
              <template slot="option" slot-scope="option">
                <div class="d-center">
                  {{ getTranslatedNameFromObject(option) }}
                  <br/>
                  <b-badge variant="light-dark" v-if="option.student && option.student.program">
                    {{ getTranslatedNameFromObject(option.student.program.faculty) }}
                    -
                    {{ getTranslatedNameFromObject(option.student.program) }}
                  </b-badge>
                  <b-badge variant="light-dark" v-if="option.instructor && option.instructor.department">
                    {{ getTranslatedNameFromObject(option.instructor.department.faculty) }}
                    -
                    {{ getTranslatedNameFromObject(option.instructor.department) }}
                  </b-badge>
                </div>
              </template>
              <template
                slot="selected-option"
                slot-scope="option"
              >
                <div class="d-center">
                  {{ getTranslatedNameFromObject(option) }}
                  <br/>
                  <b-badge variant="light-dark" v-if="option.student && option.student.program">
                    {{ getTranslatedNameFromObject(option.student.program.faculty) }}
                    -
                    {{ getTranslatedNameFromObject(option.student.program) }}
                  </b-badge>
                  <b-badge variant="light-dark" v-if="option.instructor && option.instructor.department">
                    {{ getTranslatedNameFromObject(option.instructor.department.faculty) }}
                    -
                    {{ getTranslatedNameFromObject(option.instructor.department) }}
                  </b-badge>
                </div>
              </template>
            </v-select>
            <ValidationErrors :frontend-errors="errors"/>
          </validation-provider>
        </b-form-group>
      </div>
      <b-row>
        <!-- submit and cancel -->
        <b-col md="12" style="text-align:end">
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            type="reset"
            variant="outline-secondary"
            class="mr-1"
            @click="hideContactModal"
          >
            {{ $t('Global.cancel') }}
          </b-button>
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            :disabled="loadingStartChat || !contactUser"
            @click="startContactChat()"
          >
            <b-spinner small v-if="loadingStartChat"></b-spinner>
            {{$t('Start Chat')}}
          </b-button>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import {
  BAvatar, BInputGroup, BInputGroupPrepend, BFormInput, BModal, VBModal, BFormGroup, BCol, BRow, BBadge,
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import vSelect from 'vue-select'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { ref, computed } from '@vue/composition-api'
import ChatContact from './ChatContact.vue'
import UserProfileSidebar from './UserProfileSidebar.vue'
import ValidationErrors from '@/views/components/common/ValidationErrors'
import Ripple from "vue-ripple-directive";
import {mapActions} from "vuex";

export default {
  components: {

    // BSV
    BAvatar,
    BInputGroup,
    BInputGroupPrepend,
    BFormInput,
    BModal,
    ValidationProvider,
    ValidationObserver,
    vSelect,
    ValidationErrors,

    // 3rd party
    VuePerfectScrollbar,

    // SFC
    ChatContact,
    UserProfileSidebar,

    BFormGroup,
    BCol,
    BRow,
    BBadge,
  },
  directives: {
    Ripple,
    'b-modal': VBModal,
  },
  props: {
    chatsContacts: {
      type: Array,
      required: true,
    },
    contacts: {
      type: Array,
      required: true,
    },
    shallShowUserProfileSidebar: {
      type: Boolean,
      required: true,
    },
    profileUserData: {
      type: Object,
      required: true,
    },
    profileUserMinimalData: {
      type: Object,
      required: true,
    },
    activeChatContactId: {
      type: Number,
      default: null,
    },
    mqShallShowLeftSidebar: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      showChat:true,
      selected: '',
      showContact:true,
      contactUser: null,
      searchedUsersOptions: [],
      showAddContactModal: false,
      loadingStartChat: false,
      searchLoading: false,
    }
  },
  setup(props) {
    const perfectScrollbarSettings = {
      maxScrollbarLength: 150,
    }

    const resolveChatContact = userId => props.contacts.find(contact => contact.id === userId)

    // Search Query
    const searchQuery = ref('')

    const searchFilterFunction = contact => contact.fullName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const filteredChatsContacts = computed(() => props.chatsContacts.filter(searchFilterFunction))
    const filteredContacts = computed(() => props.contacts.filter(searchFilterFunction))

    return {
      // Search Query
      searchQuery,
      filteredChatsContacts,
      filteredContacts,

      // UI
      resolveChatContact,
      perfectScrollbarSettings,
    }
  },
  methods: {
    ...mapActions({
      lookups: 'app/GET_LOOKUPS',
    }),
    openContactModal() {
      this.showAddContactModal = true
    },
    hideContactModal() {
      this.showAddContactModal = false
    },
    startContactChat() {
      this.loadingStartChat = false
      this.$router.push({ name: 'global-chat', params: { chat_id: 'one-to-one', user_id: this.contactUser } })
      // this.showAddContactModal = false
    },
    toggleContacts(){
      this.showContact=!this.showContact;
      this.$nextTick(() => {
        if (this.showContact) {
          this.$refs.contactList.scrollTop = this.$refs.contactList.scrollHeight;
          window.scrollTo({
            top: this.$refs.contactList.offsetTop + this.$refs.contactList.offsetHeight,
            behavior: "smooth",
          });
        }
        if(this.showChat && this.showContact){
          this.showChat = !this.showChat;
        }
      });
    },
    toggleChats(){
      this.showChat=!this.showChat;
      if(this.showContact && this.showChat){
        this.showContact=!this.showContact;
      }
    },
    fetchUsers(search, loading) {

      let query = {
        getChatUsers: true,
        searchQuery: search,
      }

      if (search.length > 3 && !this.searchLoading) {
        this.searchLoading = true
        loading(true)
        this.lookups(query).then((res) => {
          this.searchedUsersOptions = [
            { header: true, name: "Users", name_local: "المستخدمين" },
            ...res.success.users,
            { header: true, name: "Students", name_local: "طلاب" },
            ...res.success.students,
          ]
          loading(false)
        }).catch((err) => {
          loading(false)
        }).finally(() => {
          this.searchLoading = false
        })
      }
    },
  },
}
</script>
<style>
.icon-arrow-down:before {
  content: '\f078'; /* Font Awesome arrow-down icon */
}
.icon-arrow-up:before {
  content: '\f077'; /* Font Awesome arrow-up icon */
}
.arrow {
  display: inline-block;
  width: 0.8rem;
  height: 0.8rem;
  transition: transform 0.2s ease-in-out;
  float: right;
}
</style>
