import Resource from '../../../api/resource';
import request from '../../../utils/request';

class Question extends Resource {
    constructor() {
        super('questions');
    }


}

export {Question as default};
