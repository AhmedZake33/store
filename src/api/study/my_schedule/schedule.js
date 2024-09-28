import Resource from '../../resource';
import request from '../../../utils/request';

class Schedule extends Resource {
    constructor() {
        super('offering-schedules');
    }

    list(id,query) {
      return request({
          url: `/offering-schedules/instructor/${id}`,
          method: 'post',
          data: query,
      })
    }

    getLookups(id) {
      return request({
        url: `/offering-schedules/get_lookups/${id}`,
        method: 'get',
      });
    }

    put(id, query) {
      let url='';
      id != null ? url=`/offering-schedules/${id}` : url = `/offering-schedules`;
      return request({
          url: url,
          method: 'PUT',
          data: query,
      })
    }

    updateEvent(id, query) {
      return request({
          url: `/offering-schedules/updateEvent/${id}`,
          method: 'POST',
          data: query,
      })
    }
}

export {Schedule as default};
