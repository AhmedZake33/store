import Resource from '../../../api/resource';
import request from '../../../utils/request';

class QuestionnairesTypes extends Resource {
    constructor() {
        super('questionnaires/types');
    }

    get(id) {
        return request({
            url: `/questionnaires/types/show/${id}`,
            method: 'get',
        })
    }
}

export {QuestionnairesTypes as default};
