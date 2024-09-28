import Resource from '../../resource';
import request from '../../../utils/request';

class Methods extends Resource {

    constructor() {
        super('methods');
    }

    sync(id, query) {
        return request({
            url: `/courses/sync/${id}`,
            method: 'post',
            data: query
        });
    }

    methods(payload) {
        return request({
            url: `/quality/${payload.type}/methods`,
            method: 'post',
            data:payload.query
        });
    }
    removeMethods(id,type){
        return request({
            url: `/quality/${type}/methods${id?'/'+id:''}`,
            method: 'delete',
        }); 
    }
    putMethods(id,query,type){
        return request({
            url: `/quality/${type}/methods${id?'/'+id:''}`,
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
            url: `/staff/my-course-offerings`,
            method: 'post',
            data: query,
        })
    }

}

export {Methods as default};
