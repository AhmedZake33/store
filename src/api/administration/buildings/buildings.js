import Resource from '../../resource';
import request from '../../../utils/request';

class Building extends Resource {
    constructor() {
        super('buildings');
    }

    exportMigrationTemplate(payload) {
        return request({
            url: `/buildings/export_migrated_halls_template`,
            method: 'post',
            responseType: "blob",
            data: payload
        });
    }
}

export {Building as default};