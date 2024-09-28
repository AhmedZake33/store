<template>
  <div class="chats">
    <div
      v-for="(msgGrp, index) in formattedChatData.formattedChatLog"
      :key="msgGrp.senderId+String(index)"
      class="chat"
      :class="{'chat-left': msgGrp.senderId != authUser().id}"
    >
<!--      sender id:{{msgGrp}}
      user id:{{authUser().id}}-->
      <div class="chat-avatar">
        <b-avatar
          size="36"
          class="avatar-border-2 box-shadow-1"
          variant="transparent"
          :src="msgGrp.senderId === formattedChatData.contact.id ? formattedChatData.contact.avatar : profileUserAvatar"
        />
      </div>
      <div class="chat-body">
        <div
          v-for="msgData in msgGrp.messages"
          :key="msgData.time"
          class="chat-content"
        >
          <p v-if="msgData.sender && msgData.sender.id != authUser().id" class="message-sender">
            {{ getTranslatedNameFromObject(msgData.sender) }}
          </p>
          <a class="link-file" v-for="(file,i) in msgData.attachments" :key="i" :href="file.url" target="_blank">
            <div v-if="validImageTypes.includes(file.extension)" class="img-file">
              <img height="150px" v-lazy="file.url" />
              <span class="img-details">{{ file.size }} KB , <i>{{file.name}}</i></span>
            </div>
            <div v-else class="other-file">
              <span :class="'file-type ' + getFileTypeClass(file.extension)"> {{file.extension}} </span>
              <div class="file-info">
                <span class="file-name"> {{file.name?file.name:' - '}} </span>
                <span class="file-details">{{ file.size }} KB, {{ $t(getFileTypeClass(file.extension)) }}</span>
              </div>
            </div>
          </a>
          <a class="message-text message-text-link" v-if="msgData.msg && isValidURL(msgData.msg)" :href="msgData.msg" target="_blank">
            {{ msgData.msg }}
          </a>
          <p class="message-text" v-else>
            {{ msgData.msg }}
          </p>
          <p class="message-time">
            {{msgData.time}}
<!--            ({{moment(msgData.time).locale($i18n.locale).fromNow()}})-->
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'
import { BAvatar } from 'bootstrap-vue'

export default {
  components: {
    BAvatar,
  },
  props: {
    chatData: {
      type: Object,
      required: true,
    },
    profileUserAvatar: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const formattedChatData = computed(() => {
      const contact = {
        id: props.chatData.contact.id,
        avatar: props.chatData.contact.avatar,
      }

      let chatLog = []
      if (props.chatData.chat) {
        chatLog = props.chatData.chat.chat
      }

      const formattedChatLog = []
      let chatMessageSenderId = chatLog[0] ? chatLog[0].senderId : undefined
      let msgGroup = {
        senderId: chatMessageSenderId,
        messages: [],
      }

      chatLog.forEach((msg, index) => {
        if (chatMessageSenderId === msg.senderId) {
          msgGroup.messages.push({
            msg: msg.message,
            time: msg.time,
            attachments: msg.attachments ?? null,
            sender: msg.sent_by,
          })
        } else {
          chatMessageSenderId = msg.senderId
          formattedChatLog.push(msgGroup)
          msgGroup = {
            senderId: msg.senderId,
            messages: [{
              msg: msg.message,
              time: msg.time,
              attachments: msg.attachments ?? null,
              sender: msg.sent_by,
            }],
          }
        }
        if (index === chatLog.length - 1) formattedChatLog.push(msgGroup)
      })


      return {
        formattedChatLog,
        contact,
        profileUserAvatar: props.profileUserAvatar,
      }
    })

    const validImageTypes = ['gif', 'jpeg', 'jpg', 'png']

    return {
      formattedChatData,
      validImageTypes,
    }
  },
}
</script>

<style>
.chat-body .message-text{
  display: block;
  max-width: 500px;
  word-break: break-word;
}

.chat-body .message-text-link{
  color: #e3e3e3;
}

.chat-body .message-text-link:hover{
  color: orange;
}

.chat-body .chat-content{
}
.chat-body .link-file{
  display: block;
  text-align: center;
}
.chat-body .link-file img{
  margin: 3px;
  border-radius: 6px;
}
.chat-body .link-file div{
  /*color: #fff3dc;*/
  display: inline-block;
  max-width: 500px;
  max-height: 200px;
  width: 100%;
  overflow-wrap: break-word;
  border-radius: 5px;
  padding: 3px 9px;
  background: #438abb;
  color: white;
  font-size: 1.1em;
  /* border-radius: 6px; */
  /* color: red; */
  /* text-decoration: none; */
  margin-bottom: 5px;

  /*box-shadow: 1px 1px 5px 0px grey;*/
  position: relative;
}

.chat-body .link-file .file-type{
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

.chat-body .link-file .file-info{
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

.img-file{
  overflow: hidden;
  position: relative;
  min-width: 200px;
}
.img-file img{
  max-width: 100%;
  max-height: 100%;
}

.img-file .img-details{
  background: #606060bd;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  height: 30px;
  font-size: 12px;
  text-align: start;
  padding: 7px;
  font-weight: bold;
}

.img-file .img-details i{
  font-size: 9px !important;
  overflow: hidden;
  font-weight: lighter;
}

.chat-left .link-file div{
  background: #f1f1f1 !important;
  color: black !important;
}

.chat-left .chat-body .message-text-link{
  color: blue;
}

.chat-left .chat-body .message-text-link:hover{
  color: orange;
}

.chat-left .img-file .img-details {
  background: rgba(171, 171, 171, 0.76) !important;
  color: white;
}

.chat-body .message-sender {
  color: #0762a1;
  font-weight: bold;
  font-size: 12px;
  margin-top: -2px !important;
  margin-left: -5px !important;
}

.chat-body .message-time {
  color: #b1b1b1;
  font-size: 12px;
  text-align: right;
  margin-bottom: -2px !important;
  margin-right: -5px !important;
}

.chat-application .chat-app-window .user-chats, .chat-app-window .start-chat-area {
  background-image: url("../../../../assets/images/chat_background1.png") !important;
  background-size: 500px !important;
  background-blend-mode: overlay;
}
</style>
