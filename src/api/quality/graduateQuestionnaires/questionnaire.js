import Resource from '../../../api/resource';
import request from '../../../utils/request';

class Questionnaire extends Resource {
    constructor() {
        super('graduate/questionnaires');
    }


}

export {Questionnaire as default};
