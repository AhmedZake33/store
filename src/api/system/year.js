import Resource from '../resource';
import request from '../../utils/request';

class Year extends Resource {
    constructor() {
        super('years');
    }
removeSupplementarySubjects(id) {
    return request({
      url: `/years/${id}`,
      method: 'delete',
    });
  }
}

export {Year as default};
