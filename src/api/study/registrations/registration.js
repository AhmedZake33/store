import Resource from '../../resource';
import request from '../../../utils/request';

class Registrations extends Resource {
    constructor() {
        super('registrations');
    }

    export(payload) {
        return request({
            url: `/registrations/export`,
            method: 'post',
            responseType: "blob",
            data: payload,
        });
    }

    enrollStudents(payload) {
        return request({
            url: `/registrations/enroll_students`,
            method: 'post',
            data: payload,
        });
    }

    deleteRegistrations(payload) {
        return request({
            url: `/registrations/delete_registrations/${payload.offering_id}`,
            method: 'post',
            data: payload,
        });
    }
}

export {Registrations as default};
