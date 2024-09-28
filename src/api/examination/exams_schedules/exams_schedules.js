import Resource from '../../resource';
import request from '../../../utils/request';

class ExamsSchedules extends Resource {
    constructor() {
        super('exam-schedules');
    }
    
    list(id,query) {
        return request({
            url: id ? `/${this.uri}/${id}`:`/${this.uri}`,
            method: 'post',
            data: query,
        })
    }

    listInstructorExamsSchedules(id,query) {
        return request({
            url: id ? `/exam-schedules/instructor/${id}`:`/exam-schedules/instructor`,
            method: 'post',
            data: query,
        })
    }

    listLocationExamsSchedules(id,query) {
        return request({
            url: id ? `/exam-schedules/location/${id}`:`/exam-schedules/location`,
            method: 'post',
            data: query,
        })
    }
    
    lookups(examId, query) {
        return request({
            url: examId ? `/exam-schedules/lookups/${examId}` : `/exam-schedules/lookups`,
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

    put(id, query) {
        return request({
            url: `/${this.uri}${id ? `/${id}` : ''}`,
            method: 'put',
            data: query,
        })
    }

    getAvailableLocations(examId, query){
        return request({
            url: `/exam-schedules/get_available_locations`,
            method: 'post',
            data: query
        });
    }

    specifications(id, query) {
        return request({
            url: `/exam-schedules/specifications/${id ? id : null}`,
            method: 'put',
            data: query,
        })
    }

    getStudentsRegistrations(id, query) {
        return request({
            url: `/exam-schedules/get_students_registrations/${id}`,
            method: 'post',
            data: query,
        })
    }

    examAbsence(id, query) {
        return request({
            url: `/exam-schedules/absences${id ? `/${id}` : ''}`,
            method: 'put',
            data: query,
        })
    }

    examInvestigations(id, query) {
        return request({
            url: `/exam-schedules/investigations${id ? `/${id}` : ''}`,
            method: 'put',
            data: query,
        })
    }

    printPdf(query) {
        return request({
            url: `/exams/print-attendance-sheet`,
            method: 'post',
            data: query,
            responseType: "blob",
        })
    }

    GET_LOOKUPS(examId, query) {
        return request({
            url: examId ? `/exam-schedules/lookups/${examId}` : `/exam-schedules/lookups`,
            method: 'post',
            data: query
        });
    }

}

export {ExamsSchedules as default};
