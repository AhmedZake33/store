import Resource from '../../resource';
import request from '../../../utils/request';

class Applicant extends Resource {
    constructor() {
        super('applicants_ems');
    }

    list(payload) {
        if(payload && payload.applicant_type){
            return request({
                url: `/${this.uri}/${payload.applicant_type}`,
                method: 'post',
                data: payload.query,
                ems_url:'ems'
            })
        }else{
            return request({
                url: `/${this.uri}`,
                method: 'post',
                data: payload.query,
                ems_url:'ems'
            })
        }

    }
    changeApplicantType(id){
        return request({
            url: `/applicants/change-type/${id}`,
            method: 'put',
        })
    }
    changeStatus(payload) {
        return request({
            url: `/${this.uri}/${payload.id}`,
            method: 'PUT',
            data: payload.query
        })
    }

    bulkChangeStatus(payload) {
        return request({
            url: `/applicants/bulk/change-status`,
            method: 'post',
            data: payload
        })
    }

    assignProgram(payload) {
        return request({
            url: `/applicants/assign/${payload.id}`,
            method: 'post',
            data: payload.query
        })
    }

    bulkAssignProgram(payload) {
        return request({
            url: `/applicants/bulk/assign`,
            method: 'post',
            data: payload.query
        })
    }

    lookup(payload) {
        return request({
            url: `/lookups/get`,
            method: 'post',
            data: payload
        });
    }

    reports(payload) {
        return request({
            url: `/${this.uri}/report`,
            method: 'post',
        });
    }

    upload(resource) {
        return request({
            url: `/applicants/import`,
            method: 'post',
            data: resource,
        })
    }

    acceptDesire(payload) {
        return request({
            url: `/${this.uri}/distribution/${payload.id}`,
            method: 'PUT',
            data: payload.query
        })
    }

    changeDesire(payload) {
        return request({
            url: `/${this.uri}/change/desire/${payload.id}`,
            method: 'post',
            data: payload.query
        })
    }

    bulk(payload) {
        return request({
            url: `/applicants/bulk/distribution`,
            method: 'post',
            data: payload
        })
    }

    removeSubject(payload) {
        return request({
            url: `subjects/${payload}`,
            method: 'delete',
        });
    }
    export(payload) {
        if(payload && payload.applicant_type){
            return request({
                url: `/${this.uri}/export/${payload.applicant_type}`,
                method: 'post',
                responseType: "blob",
                data: payload.query,
            });
        }
        else{
            return request({
                url: `/${this.uri}/export`,
                method: 'post',
                responseType: "blob",
                data: payload,
            });
        }

    }

    lookup(payload){
        return request({
            url: `${this.uri}/lookups/${payload.applicant_id}`,
            method: 'post',
            data: payload.query,
          });
    }

    assignTags(query) {
        return request({
            url: `/tags/attach-applicants`,
            method: 'post',
            data: query,
        })
    }

    removeTags(query) {
        return request({
            url: `/tags/remove-applicants/tags`,
            method: 'post',
            data: query,
        })
    }

}

export {Applicant as default};
