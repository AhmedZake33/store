import Resource from '../../../api/resource';
import request from '../../../utils/request';

class Course extends Resource {

    constructor() {
        super('courses_ems');
    }

    sync(id, query) {
        return request({
            url: `/courses/sync/${id}`,
            method: 'post',
            data: query
        });
    }

    exportSpecs(payload) {
        return request({
            url: `/quality/courses-specs/export-${payload.type}/${payload.id}`,
            method: 'get',
            responseType: "blob",
        });
    }

    export(payload) {
        return request({
            url: `/courses/export`,
            method: 'post',
            responseType: "blob",
            data: payload,
        });
    }

    exportUniversityRequirements(payload) {
        return request({
            url: `/courses/export-university-requirements`,
            method: 'post',
            responseType: "blob",
            data: payload,
        });
    }

    exportFacultyRequirements(payload) {
        return request({
            url: `/courses/export-faculty-requirements`,
            method: 'post',
            responseType: "blob",
            data: payload,
        });
    }

    exportUniversityRequirements(payload) {
        return request({
            url: `/courses/export-university-requirements`,
            method: 'post',
            responseType: "blob",
            data: payload,
        });
    }

    listWorkSpace(query) {
        return request({
            url: `/staff/instructor-courses`,
            method: 'post',
            data: query,
        })
    }

    exportMigrationTemplate() {
        return request({
            url: `/courses/export_migrated_courses_template`,
            method: 'post',
            responseType: "blob",
        });
    }

    listUniversityFacultyRequirements(id,query) {
        return request({
            url: `/programs/university_faculty_requirements${id ? '/'+id : ''}`,
            method: 'post',
            data: query,
        })
    }
}

export {Course as default};
