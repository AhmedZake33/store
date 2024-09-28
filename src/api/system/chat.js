import Resource from '../resource'
import request from '../../utils/request'

class Chat extends Resource {
  constructor() {
    super('chats')
    this.myChatUrl = "my-chats";
  }

  // for my chats
  getChats() {
    return request({
      url: `${this.myChatUrl}/chats`,
      method: 'get',
    })
  }

  getChat(chatId,userId) {
    return request({
      url: `${this.myChatUrl}/${chatId}/messages/${userId}`,
      method: 'get',
    })
  }

  getChatById(chatId,userId) {
    const newUrl = userId ? `${this.uri}/${chatId}/${userId}` : `${this.uri}/${chatId}`
    return request({
      url: newUrl,
      method: 'get',
    })
  }

  sendMessage(chatId,userId, form) {
    return request({
      url: `${this.myChatUrl}/${chatId}/messages/${userId}`,
      method: 'post',
      data: form,
    })
  }

  getUserProfile() {
    return request({
      url: `${this.myChatUrl}/profile-user`,
      method: 'get',
    })
  }

  checkNewMessages(chatId,payload) {
    return request({
      url: `${this.myChatUrl}/${chatId}/check-new-messages`,
      method: 'get',
      params: payload,
    })
  }
}

export { Chat as default }
