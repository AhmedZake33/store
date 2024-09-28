<template>
  <!-- Need to add height inherit because Vue 2 don't support multiple root ele -->
  <div style="height: inherit">
    <!-- Main Area -->
    <section class="chat-app-window">

      <!-- Start Chat Logo -->
      <div
          v-if="!activeChat.contact"
          class="start-chat-area"
      >
        <div class="mb-1 start-chat-icon">
          <feather-icon
              icon="MessageSquareIcon"
              size="56"
          />
        </div>
      </div>

      <!-- Chat Content -->
      <div
          v-else
          class="active-chat"
      >
        <!-- Chat Navbar -->
        <div class="chat-navbar">
          <header class="chat-header">

            <!-- Avatar & Name -->
            <div class="d-flex align-items-center">

              <!-- Toggle Icon -->
              <div class="sidebar-toggle d-block d-lg-none mr-1">
                <feather-icon
                    icon="MenuIcon"
                    class="cursor-pointer"
                    size="21"
                    @click="mqShallShowLeftSidebar = true"
                />
              </div>

              <b-avatar
                  size="36"
                  :src="activeChat.contact.avatar"
                  class="mr-1 cursor-pointer badge-minimal"
                  badge
                  :badge-variant="resolveAvatarBadgeVariant(activeChat.contact.status)"
                  @click.native="shallShowActiveChatContactSidebar=true"
              />
              <h6 class="mb-0">
                {{ activeChat.contact.fullName }}
              </h6>
            </div>
          </header>
        </div>

        <!-- User Chat Area -->
        <vue-perfect-scrollbar
            ref="refChatLogPS"
            :settings="perfectScrollbarSettings"
            class="user-chats scroll-area"
        >
          <chat-log
              :chat-data="activeChat"
              :profile-user-avatar="profileUserDataMinimal.avatar"
          />
        </vue-perfect-scrollbar>

        <div v-if="!attachFileProcessing" class="selected-files">
          <span class="header">
            {{ $t("selected_files") }} <small> {{ $t("selected_files_constraints") }} </small>
            <feather-icon
                class="close"
                icon="XCircleIcon"
                size="22"
                @click="resetAttachedFiles()"
                v-if="!sending"
            />
          </span>
          <div class="d-inline file-block" v-for="(file,i) in imageUrl" :key="i">
              <div v-if="file && file.imageData" class="image-preview">
                <img height="150px" :src="file.imageData" />
                <b class="file-type image-type">{{file.type.toUpperCase()}}</b>
              </div>
              <div v-else-if="file" class="preview">
                {{file.name}}
                <b :class="'file-type ' + getFileTypeClass(file.type)">{{file.type.toUpperCase()}}</b>
              </div>
              <div class="file-size">{{ file.size }} KB</div>
          </div>
        </div>

        <!-- Message Input -->
        <b-form
            class="chat-app-form"
            @submit.prevent="sendMessage"
        >
          <div>
            <button @click="$refs.attachmentFiles.click()" type="button" class="input-group-text">
              <feather-icon
                  icon="LinkIcon"
                  size="20"
                  :badge="!attachFileProcessing && imageUrl && imageUrl.length"
                  badge-classes="badge-danger"
                  badge-style="margin:-25px"
              />
            </button>
            <input
                style="display:none"
                ref="attachmentFiles"
                @change="onEventFilePicked"
                type="file"
                name="upload"
                accept=".xlsx, .csv,.xls, image/*, .doc, .docx, .ppt, .pptx, .txt, .pdf"
                multiple
            />
          </div>

          <b-input-group class="input-group-merge form-send-message mr-1 ml-1">
            <b-form-input
                v-model="chatInputMessage"
                :placeholder="$t('Enter your message')"
                :disabled="sending"
            />
          </b-input-group>
          <b-button
              variant="primary"
              type="submit"
              :disabled="(!chatInputMessage && attachFileProcessing) || sending"
          >
            {{ $t('Send') }}
          </b-button>
        </b-form>
      </div>
    </section>
  </div>
</template>

<script>

import store from '@/store'
import {
  ref, onUnmounted, nextTick,
} from '@vue/composition-api'
import {
  BAvatar, BDropdown, BDropdownItem, BForm, BInputGroup, BFormInput, BButton
} from 'bootstrap-vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import chatStoreModule from './components/chatStoreModule'
import ChatLog from './components/ChatLog.vue'
import useChat from './components/useChat'

export default {
  components: {

    // BSV
    BAvatar,
    BDropdown,
    BDropdownItem,
    BForm,
    BInputGroup,
    BFormInput,
    BButton,

    // 3rd Party
    VuePerfectScrollbar,

    // SFC
    ChatLog,
  },
  setup(props,context) {
    const router = context.root.$router;
    const route = context.root.$route;
    const CHAT_APP_STORE_MODULE_NAME = 'app-chat'

    // Register module
    if (!store.hasModule(CHAT_APP_STORE_MODULE_NAME)) store.registerModule(CHAT_APP_STORE_MODULE_NAME, chatStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(CHAT_APP_STORE_MODULE_NAME)) store.unregisterModule(CHAT_APP_STORE_MODULE_NAME)
    })

    const { resolveAvatarBadgeVariant } = useChat()

    // Scroll to Bottom ChatLog
    const refChatLogPS = ref(null)
    const scrollToBottomInChatLog = () => {
      const scrollEl = refChatLogPS.value.$el || refChatLogPS.value
      scrollEl.scrollTop = scrollEl.scrollHeight
    }

    // ------------------------------------------------
    // Single Chat
    // ------------------------------------------------
    const activeChat = ref({})
    const chatInputMessage = ref('')
    const attachmentFiles = ref(null)
    // ? Will contain id, name and avatar & status
    const profileUserDataMinimal = ref({})
    const openChatOfContact = (userId, chatId, skipClearMessageField=false) => {
      // Reset send message input value
      if (!skipClearMessageField) chatInputMessage.value = ''
      store.dispatch('app-chat/getChatById', { userId, chatId })
        .then(response => {
          activeChat.value = response.data
          profileUserDataMinimal.value = response.data.contact

          if (response.data.chat.id && chatId === 'one-to-one') {
            router.replace({ name: 'global-chat', params: { chat_id: response.data.chat.id, user_id: userId }, replace: true })
          }

          store.commit('app/UPDATE_PAGE_DETAILS', { name: response.data.contact.fullName, name_name: response.data.contact.fullName }, { root: true })

          // Scroll to bottom
          nextTick(() => { scrollToBottomInChatLog() })
        })
    }

    // Now you can access params like:
    const userId = route.params.user_id;
    const chatId = route.params.chat_id;
    openChatOfContact(userId, chatId);

    const imageUrl = ref([]);
    const attachFileProcessing = ref(true)
    const resetAttachedFiles = () => {
      attachmentFiles.value.value = ''
      imageUrl.value = []
      attachFileProcessing.value = false;
      attachFileProcessing.value = true;
    }
    const validateFileSize = (file) => {
      /*
        Maximum allowed size in bytes
        5MB
        Change first operand(multiplier) for your needs
        */
      const maxAllowedSize = 3 * 1024 * 1024
      if (file.size > maxAllowedSize) {
        // Here you can ask your users to load correct file
        return false
      }
      return true
    }

    const sending = ref(false)
    const sendMessage = () => {
      const selectedFiles = attachmentFiles.value.files;

      if (!chatInputMessage.value && !selectedFiles.length) return
      if (sending.value) return

      if (selectedFiles.length > 12) {
        alert('Sorry You Must Select Max 12 Files')
        return
      }

      sending.value = true

      const formData = new FormData();
      formData.append('message', chatInputMessage.value);

      for (let i = 0; i < selectedFiles.length; i++) {
        if (!validateFileSize(selectedFiles[i])) continue
        formData.append('files[' + i + ']', selectedFiles[i])
      }

      const payload = {
        chatId: activeChat.value.chat.id,
        // eslint-disable-next-line no-use-before-define
        senderId: profileUserDataMinimal.value.id,
        userId: activeChat.value.chat.userId,
        form: formData,
      }

      store.dispatch('app-chat/sendMessage', payload)
        .then(response => {
          const { newMessageData, chat } = response.data

          // ? If it's not undefined => New chat is created (Contact is not in list of chats)
          if (chat !== undefined) {
            activeChat.value = { chat, contact: activeChat.value.contact }
            router.replace({ name: 'global-chat', params: { chat_id: chat.id, user_id: userId }, replace: true })
          } else {
            // Add message to log
            activeChat.value.chat.chat.push(newMessageData)
          }

          // Reset send message input value
          chatInputMessage.value = ''
          resetAttachedFiles()

          // Scroll to bottom
          nextTick(() => { scrollToBottomInChatLog() })
        }).finally(() => {
          sending.value = false
        })
    }

    const perfectScrollbarSettings = {
      maxScrollbarLength: 150,
    }

    // User Profile Sidebar
    // ? Will contain all details of profile user (e.g. settings, about etc.)
    const profileUserData = ref({})

    // ------------------------------------------------
    // Processing Attached Message Files
    // ------------------------------------------------
    let files = null
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png']
    const onEventFilePicked = (event) => {
      imageUrl.value = [];
      attachFileProcessing.value = true

      files = event.target.files

      for (let i=0; i<files.length; i++){
        const file = files[i]

        if (!validateFileSize(file)) continue

        let filename = file.name
        const fileType = file ? file.type : 'unknown'

        const lastDot = filename.lastIndexOf('.')
        const ext = filename.substring(lastDot + 1)
        filename = filename.substring(0, lastDot)


        imageUrl.value[i] = { type: ext, name: filename, size: (file.size/1204).toFixed(2) }
        if (validImageTypes.includes(fileType)) {
          const fileReader = new FileReader()
          fileReader.addEventListener('load', (event) => {
            imageUrl.value[i] = { ...imageUrl.value[i], imageData: fileReader.result }
            attachFileProcessing.value = true
            attachFileProcessing.value = false
          })
          fileReader.readAsDataURL(files[i])
        }
      }
      attachFileProcessing.value = false;
    }

    return {
      // useChat
      resolveAvatarBadgeVariant,

      // Single Chat
      refChatLogPS,
      activeChat,

      chatInputMessage,
      attachmentFiles,
      imageUrl,
      onEventFilePicked,
      resetAttachedFiles,
      attachFileProcessing,
      sending,

      openChatOfContact,
      sendMessage,

      // Profile User Minimal Data
      profileUserDataMinimal,

      // User Profile Sidebar
      profileUserData,

      // UI
      perfectScrollbarSettings,
    }
  },
  mounted() {
    // check if new messages founded or not
    setInterval(() => {
      this.checkNewMessages()
    }, 30000)
  },
  methods: {
    checkNewMessages() {
      if (!(this.activeChat && this.activeChat.chat.id > 0)) return

      const payload = {
        chatId: this.activeChat.chat.id,
        payload: {
          messages_count: this.activeChat.chat.chat.length
        },
      }
      store.dispatch('app-chat/checkNewMessages', payload).then(response => {
        if( response.data.new_messages_status == true ){
          this.openChatOfContact(this.activeChat.chat.userId, this.activeChat.chat.id,true);
        }
      })
    },
  }
}
</script>

<style lang="scss">
@import "@core/scss/base/pages/app-chat.scss";
@import "@core/scss/base/pages/app-chat-list.scss";
@import "./components/custom-chat-style.scss";

body .content-right {
  width: 100%;
  margin-top: 20px;
}

.chat-application .content-area-wrapper {
  //border: 1px solid #ebe9f1;
  border: none;
}
</style>
