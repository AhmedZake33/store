import axios from '@axios'
import Chat from '../../../../api/system/chat';

const chatApis = new Chat();

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchChatsAndContacts() {
      return new Promise((resolve, reject) => {
        chatApis.getChats().then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response);
        })
      })
    },
    getProfileUser() {
      return new Promise((resolve, reject) => {
        chatApis.getUserProfile().then(response => {
          resolve(response)
        }).catch(error => {
          reject(error.response)
        })
      })
    },
    getChat(ctx, { userId, chatId }) {
      return new Promise((resolve, reject) => {
        chatApis.getChat(chatId,userId).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response);
        });
      });
    },
    getChatById(ctx, { userId, chatId }) {
      return new Promise((resolve, reject) => {
        chatApis.getChatById(chatId,userId).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response);
        });
      });
    },
    sendMessage(ctx, { chatId, senderId, userId, form }) {
      return new Promise((resolve, reject) => {
        chatApis.sendMessage(chatId, userId, form).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error.response)
        })
      })
    },
    checkNewMessages(ctx, { chatId, payload }) {
      return new Promise((resolve, reject) => {
        chatApis.checkNewMessages(chatId,payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response);
        });
      });
    },
  },
}
