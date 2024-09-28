import Resource from '../../../api/resource';
import request from '../../../utils/request';

class Student extends Resource {
    constructor() {
        super('students_ems');
    }

    // get(payload, params = {}) {
    //   if (typeof payload === 'object') {
    //     return request({
    //       url: `/students/details/student/get/${payload.id}/${payload.type}`,
    //       method: 'get',
    //     })
    //   }
    //   return request({
    //     url: `/students/details/student/get/${payload}`,
    //     method: 'get',
    //     params,
    //   })
    // }

    home(id) {
        return request({
            url: `/students/dashboard/${id}`,
            method: 'post',
        });
    }

    getEdit(payload) {
        return request({
            url: `/students/Edit/${payload.id}/${payload.details}`,
            method: 'get',
        });
    }

    lookup(payload) {
        return request({
            url: `/lookups/get`,
            method: 'post',
            data: payload
        });
    }

    export(payload) {
        return request({
            url: `/students/export`,
            method: 'post',
            responseType: "blob",
            data: payload
        });
    }

    search(payload) {
        return request({
            url: `/students/search`,
            method: 'post',
            data: payload,
        })
    }

    studentCourses() {
        return request({
            url: `/students/courses`,
            method: 'get',

        })
    }

    show_my_course(offering_id) {
        return request({
            url: `/students/courses/${offering_id}`,
            method: 'get',
        })
    }

    put(id, query, details) {
        return request({
            url: `/${this.uri}${id ? `/${id}` : ''}/${details}`,
            method: 'put',
            data: query,
        })
    }

    transcript(payload) {
        return request({
            url: `/students/${payload.id}/transcript/${payload.lang}`,
            responseType: 'blob',
            method: 'get',
        })
    }

    MasterCertificate(payload) {
        return request({
            url: `/students/${payload.id}/MasterCertificate/${payload.lang}`,
            responseType: 'blob',
            method: 'get',
        })
    }

    exportMigrationTemplate() {
        return request({
            url: `/students/export_migrated_students_template`,
            method: 'post',
            responseType: "blob",
        });
    }
    certificate(payload) {
        return request({
            url: `/students/${payload.id}/certificate/${payload.lang}`,
            responseType: 'blob',
            method: 'post',
            data: payload,
        })
    }

    exportMigrationTemplate() {
        return request({
            url: `/students/export_migrated_students_template`,
            method: 'post',
            responseType: "blob",
        });
    }

    assignTags(query) {
        return request({
            url: `/tags/attach`,
            method: 'post',
            data: query,
        })
    }

    removeTags(query) {
        return request({
            url: `/tags/remove-student/tags`,
            method: 'post',
            data: query,
        })
    }

    updateNotes(id, query) {
        return request({
            url: `/${this.uri}/update_notes${id ? `/${id}` : ''}`,
            method: 'post',
            data: query,
        })
    }
}

export {Student as default};
