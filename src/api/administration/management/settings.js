import Resource from '../../resource';
import request from "../../../utils/request";

class Settings extends Resource {
    constructor() {
        super('settings');
    }

    put(id, query) {
        return request({
            url: `/settings${id?'/'+id:''}`,
            method: 'put',
            data: query,
        })
    }
    editSupplementarySubjects(id, query) {
        return request({
            url: `/settings${id?'/'+id:''}`,
            method: 'put',
            data: query,
        })
    }
    get(id) {
        return request({
            url: `/settings${id?'/'+id:''}`,
            method: 'get',
        })
    }
    enrollmentSetting(id, query) {
        return request({
            url: `/settings/enrollment-setting${id?'/'+id:''}`,
            method: 'put',
            data: query,
        })
    }

}

export {Settings as default};
