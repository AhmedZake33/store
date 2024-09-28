import Resource from '../../../api/resource';
import request from '../../../utils/request';

class Questionnaire extends Resource {
    constructor() {
        super('student/questionnaires');
    }


}

export {Questionnaire as default};
