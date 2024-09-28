import Resource from '../../../api/resource';
import request from '../../../utils/request';

class QuestionnairesQuestions extends Resource {
    constructor() {
        super('questionnaires/questions');
    }

    reorderQuestion(id, newOrder) {
        return request({
            url: `/questionnaires/questions/reorder/${id}/${newOrder}`,
            method: 'put'
        })
    }
}

export {QuestionnairesQuestions as default};
