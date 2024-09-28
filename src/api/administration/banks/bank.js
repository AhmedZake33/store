import Resource from '../../resource';
import request from '../../../utils/request';

class Bank extends Resource {
    constructor() {
        super('banks');
    }

    exportMigrationTemplate(payload) {
        return request({
            url: `/buildings/export_migrated_halls_template`,
            method: 'post',
            responseType: "blob",
            data: payload
        });
    }

    currencyList(payload) {
        return request({
            url: `/banks/currency`,
            method: 'post',
            responseType: "blob",
            data: payload
        });
    }
}

export {Bank as default};