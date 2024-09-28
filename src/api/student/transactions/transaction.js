import Resource from '../../resource';
import request from '../../../utils/request';

class Transaction extends Resource {
    constructor() {
        super('transactions');
    }

    exportData(query) {
        return request({
            url: `/transactions/export-transactions`,
            method: 'post',
            data: query,
            responseType: "blob",
        })
    }

    cancelTransaction(query) {
        return request({
            url: `/transactions/cancel-transaction`,
            method: 'post',
            data: query,
        })
    }

}

export {Transaction as default};
