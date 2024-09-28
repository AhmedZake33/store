import Resource from '../../resource';
import request from '../../../utils/request';

class Outcomes extends Resource {

    constructor() {
        super('outcomes');
    }

    sync(id, query) {
        return request({
            url: `/courses/sync/${id}`,
            method: 'post',
            data: query
        });
    }

    outcomes(payload) {
        return request({
            url: `/quality/${payload.type}/outcomes`,
            method: 'post',
            data:payload.query
        });
    }
    removeOutcomes(id,type){
        return request({
            url: `/quality/${type}/outcomes${id?'/'+id:''}`,
            method: 'delete',
        }); 
    }
    putOutcomes(id,query){
        return request({
            url: `/quality/courses-specs/outcomes${id?'/'+id:''}`,
            method: 'put',
            data:query
        });
    }
    removeProgramsOutcomes(id){
        return request({
            url: `/quality/programs-specs/outcomes${id?'/'+id:''}`,
            method: 'delete',
        }); 
    }
    programOutcomes(id, query) {
        return request({
            url: `/quality/programs-specs/outcomes`,
            method: 'post',
            data:query
        });
    }
    putProgramOutcomes(id,query){
        return request({
            url: `/quality/programs-specs/outcomes${id?'/'+id:''}`,
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

export {Outcomes as default};
