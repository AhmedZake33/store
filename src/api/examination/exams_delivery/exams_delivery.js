import Resource from '../../resource';
import request from '../../../utils/request';

class ExamsDelivery extends Resource {
    constructor() {
        super('exam-deliveries');
    }
    
    list(id,query) {
        return request({
            url: id ? `/${this.uri}/${id}`:`/${this.uri}`,
            method: 'post',
            data: query,
        })
    }
    
    lookups(examId, query) {
        return request({
            url: examId ? `/exam-deliveries/lookups/${examId}` : `/exam-deliveries/lookups`,
            method: 'post',
            data: query
        });
    }

    get(payload, params = {}) {
        if (typeof payload === 'object') {
            return request({
                url: `/${this.uri}/${payload.id}/${payload.type}`,
                method: 'get',
            })
        }
        return request({
            url: `/${this.uri}/${payload}`,
            method: 'get',
            params,
        })
    }

    put(id, query, apiCallingParameter) {
        return request({
            url: `/exam-deliveries/${apiCallingParameter}/${id}`,
            method: 'put',
            data: query,
        })
    }

}

export {ExamsDelivery as default};
