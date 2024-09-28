import Resource from '../../resource';
import request from '../../../utils/request';

class Assessments extends Resource {

    constructor() {
        super('assessments');
    }

    sync(id, query) {
        return request({
            url: `/courses/sync/${id}`,
            method: 'post',
            data: query
        });
    }

    assessments(payload) {
        return request({
            url: `/quality/${payload.type}/assessments`,
            method: 'post',
            data:payload.query
        });
    }
    removeAssessments(id,type){
        return request({
            url: `/quality/${type}/assessments${id?'/'+id:''}`,
            method: 'delete',
        }); 
    }
    putAssessments(id,query,type){
        return request({
            url: `/quality/${type}/assessments${id?'/'+id:''}`,
            method: 'put',
            data:query
        });
    }
    lookups(payload){
        return request({
            url: `/quality/${payload.type}/assessments/lookups`,
            method: 'get',
            data:payload.query
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

export {Assessments as default};
