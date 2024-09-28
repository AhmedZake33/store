import Resource from '../../../api/resource';
import request from '../../../utils/request';

class Employee extends Resource {
    constructor() {
        super('employees_ems');
    }

    export(payload){
        return request({
            url: `/employees/export`,
            method: 'post',
            responseType: "blob",
            data:payload
        });
    }

    exportMigrationTemplate() {
        return request({
            url: `/employees/export_migrated_employees_template`,
            method: 'post',
            responseType: "blob",
        });
    }
}

export {Employee as default};
