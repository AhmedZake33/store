import Resource from '../resource'
import request from '../../utils/request'

class CertificatesSettings extends Resource {
  constructor() {
    super('services-settings/certificates')
  }

  list(query) {
    return request({
      url: '/services-settings/certificates/list?details=certificates',
      method: 'post',
      data: query,
    })
  }

  put(id, query) {
    let url = ''
    id != null ? url = `/services-settings/certificates/${id}` : url = 'services-settings/certificates'
    return request({
      url,
      method: 'post',
      data: query,
    })
  }

  lookup() {
    return request({
      url: '/services-settings/certificates/services/lookups',
      method: 'get',
    })
  }

  export(payload) {
    return request({
      url: '/services-settings/export',
      method: 'post',
      responseType: 'blob',
      data: payload,
    })
  }
}

export { CertificatesSettings as default }
