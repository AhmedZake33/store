import request from '@/utils/request';


class Global {

  getLookups(query) {
    return request({
      url: '/lookups/get',
      method: 'post',
      data: query,
    });
  }

  lookupsApi(payload) {
    return request({
      url: `/${payload.link}`,
      method: 'post',
      data: payload.query,
      ems_url:'ems'
    });
  }
  dependentLookupsApi(payload) {
    return request({
      url: `/${payload.link}`,
      method: 'post',
      data: payload.query,
      ems_url:'ems'
    });
  }

  getIndexLookups(query) {
    return request({
      url: '/lookups/index',
      method: 'post',
      data: query,
    });
  }

  getUserLiveData(query = {}) {
    return request({
      url: '/users/live-data',
      method: 'get',
      params: query,
    });
  }
  
  getGroupedUniversityData(query = {}) {
    return request({
      url: '/university/data_grouped',
      method: 'get',
      params: query,
    });
  }

  UpdateUniversityData(payload) {
    return request({
      url: `/university/update/${payload.id}`,
      method: 'post',
      data: payload.query,
    });
  }

  getCurrentTerms(query = {}) {
    return request({
      url: '/system/current-terms',
      method: 'get',
      params: query,
    });
  }
}
export { Global as default };
