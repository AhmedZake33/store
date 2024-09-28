import Resource from '../../resource';
import request from '../../../utils/request';

class Schedule extends Resource {
    constructor() {
        super('offering-schedules');
    }

    list(id,type,query) {
      return request({
          url: id ? `/offering-schedules/${type}/${id}` : `/offering-schedules/${type}`,
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

    officeHoures(query,id) {
      let url= id ? `/offering-schedules/office-hours/${id}` : `/offering-schedules/office-hours`;
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
