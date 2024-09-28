import Resource from '../../../api/resource';
import request from '../../../utils/request';

class Instructor extends Resource {
    constructor() {
        super('instructors_ems');
    }


    reports() {
        return request({
            url: `/instructors/reports`,
            method: 'post',
        });
    }

    export(payload) {
        return request({
            url: `/instructors/export`,
            method: 'post',
            responseType: "blob",
            data: payload,
        });
    }

    removeDepartmentLink(payload) {
        return request({
            url: `/${this.uri}/remove-department-link`,
            method: 'post',
            data: payload,
        })
    }

    exportMigrationTemplate() {
        return request({
            url: `/instructors/export_migrated_instructors_template`,
            method: 'post',
            responseType: "blob",
        });
    }
}

export {Instructor as default};
