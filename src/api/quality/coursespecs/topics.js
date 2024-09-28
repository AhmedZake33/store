import Resource from '../../resource';
import request from '../../../utils/request';

class Topics extends Resource {

    constructor() {
        super('topics');
    }

    sync(id, query) {
        return request({
            url: `/courses/sync/${id}`,
            method: 'post',
            data: query
        });
    }

    topics(payload) {
        return request({
            url: `/quality/${payload.type}/topics`,
            method: 'post',
            data:payload.query
        });
    }
    removeTopics(id,type){
        return request({
            url: `/quality/${type}/topics${id?'/'+id:''}`,
            method: 'delete',
        }); 
    }
    putTopics(id,query,type){
        return request({
            url: `/quality/${type}/topics${id?'/'+id:''}`,
            method: 'put',
            data:query
        });
    }

    export(payload){
        return request({
            url: `/courses/export`,
            method: 'post',
            responseType: "blob",
            data:payload,
        });
    }

    listWorkSpace(query){
        return request({
            url: `/staff/instructor-courses`,
            method: 'post',
            data: query,
        })
    }

}

export {Topics as default};
