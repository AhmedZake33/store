import Resource from '../../resource';
import request from '../../../utils/request';

class Currency extends Resource {
    constructor() {
        super('currencies');
    }
}

export {Currency as default};