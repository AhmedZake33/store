import Resource from '../../../api/resource';
import request from '../../../utils/request';

class Chat extends Resource {

    constructor() {
        super('chats');
    }

    messages(payload) {
        return request({
            url: `/chats/messages/${payload.id}`,
            method: 'post',
            data: payload.query,
        });
    }

    message(id, resource) {
        return request({
            url: `/chats/message/${id}`,
            method: 'post',
            data: resource,
        });
    }
}

export {Chat as default};
