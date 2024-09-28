import Resource from '../../resource';
import request from '../../../utils/request';

class BankInfo extends Resource {
    constructor() {
        super('bank-info');
    }

    note() {
        return request({
            url: `/bank-info/notes`,
            method: 'get',
        });
    }
    putNote(payload) {
        return request({
            url: `/bank-info/notes`,
            method: 'put',
            data: payload
        });
    }
}

export {BankInfo as default};