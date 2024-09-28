import Resource from '../../resource';
import request from '../../../utils/request';

class Exams extends Resource {
    constructor() {
        super('exams');
    }

    lookups() {
        return request({
            url: `/exams/lookups`,
            method: 'get'
        });
    }

}

export {Exams as default};
