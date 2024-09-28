import Resource from '../../resource';
import request from '../../../utils/request';

class ExamsPunishments extends Resource {
    constructor() {
        super('exam-punishment');
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
            url: examId ? `/exam-punishment/lookups/${examId}` : `/exam-punishments/lookups`,
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

    put(query) {
        return request({
            url: `/exam-punishment`,
            method: 'put',
            data: query
        })
    }

    get_student_info(query) {
        return request({
            url: `/exam-punishment/get_student_info`,
            method: 'post',
            data: query
        });
    }
   
}

export {ExamsPunishments as default};
