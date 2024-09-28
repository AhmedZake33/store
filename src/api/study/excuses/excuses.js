import Resource from '../../resource';
import request from '../../../utils/request';

class Excuse extends Resource {
    constructor() {
        super('excuses');
    }

    getLookups(id) {
      return request({
        url: id ? `/excuses/get_lookups/${id}`: `/excuses/get_lookups`,
        method: 'get',
      });
    }

    put(id, query) {
      let url='';
      id != null ? url=`/excuses/${id}` : url = `/excuses`;
      return request({
          url: url,
          method: 'POST',
          data: query,
      })
    }

    updateStatus(id, query) {
      return request({
          url: `/excuses/update_status/${id}`,
          method: 'POST',
          data: query,
      })
    }
}

export {Excuse as default};
