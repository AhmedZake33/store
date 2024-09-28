import Resource from '../../resource';
import request from '../../../utils/request';

class Scholarship extends Resource {
    constructor() {
        super('scholarships');
    }

    list(query) {
        return request({
            url: `scholarship/get-scholarship`,
            method: 'post',
            data: query
        })
    }

    scholarships(id,query) {
        return request({
            url: `students/scholarships/get-scholarship/${id}`,
            method: 'post',
            data: query
        })
    }

    exportDataExcel(query) {
        return request({
            url: `scholarship/export_pdf`,
            method: 'post',
            data: query,
            responseType: "blob",
        })
    }

}

export {Scholarship as default};
