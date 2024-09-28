import Resource from '../../resource';
import request from '../../../utils/request';

class Location extends Resource {
    constructor() {
        super('locations');
    }
}

export {Location as default};
