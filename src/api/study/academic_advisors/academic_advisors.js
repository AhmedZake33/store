import Resource from '../../resource';
import request from '../../../utils/request';

class academicAdvisors extends Resource {
    constructor() {
        super('academic-advisors');
    }

    listAdvisors(query) {
        return request({
            url: `/advisors/academic-advisors`,
            method: 'POST',
            data: query,
        })
    }
    export(payload) {
        return request({
            url: `/advisors/export`,
            method: 'post',
            responseType: "blob",
            data: payload,
        });
    }
    avalibleAdvisorsList(query) {
        return request({
            url: `/advisors/available-advisors`,
            method: 'POST',
            data: query,
        })
      }

    advisedStudents(payload) {
        return request({
            url: `/advisors/advised-students`,
            method: 'POST',
            data: payload,
        })
    }

    searchInAdvisors(payload) {
        return request({
            url: `/advisors/search-in-advisors`,
            method: 'get',
            params: payload,
        })
    }

    findAdvisorsByFaculty(payload) {
        return request({
            url: `/advisors/advisors-by-faculty`,
            method: 'get',
            params: payload,
        })
    }

    bulkAssignStudentsAdvisor(payload) {
        return request({
            url: `/advisors/assign-bulk-students`,
            method: 'put',
            data: payload,
        })
    }
    deleteAdvisor(advisorId){
        return request({
            url: `/advisors/delete-advisors/${advisorId}`,
            method: 'put'
        })
    }

    addAdvisors(payload){
        return request({
            url: '/advisors/add-advisors',
            method: 'put',
            data: payload,
        })
    }
  
  
}

export {academicAdvisors as default};
