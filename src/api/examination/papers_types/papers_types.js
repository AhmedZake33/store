import Resource from '../../resource';
import request from '../../../utils/request';

class PapersTypes extends Resource {
    constructor() {
        super('exam-papers-types');
    }

    lookups() {
        return request({
            url: `/exam-papers-types/lookups`,
            method: 'get'
        });
    }

}

export {PapersTypes as default};
