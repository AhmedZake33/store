import Resource from '../resource'
import request from '../../utils/request'

class CertificatesDates extends Resource {
  constructor() {
    super('certificates')
  }

  list(query) {
    return request({
      url: '/certificates_dates/list',
      method: 'post',
      data: query,
    })
  }

  lookups(yearId) {
    return request({
      url: `/certificates_dates/lookups/${yearId}`,
      method: 'get',
    })
  }

  updateCertificatesDates(id,query) {
    return request({
      url: id ? `/certificates_dates/put/${id}` : `/certificates_dates/put`,
      method: 'post',
      data: query
    })
  }

  remove(id) {
    return request({
        url: `/certificates_dates/${id}`,
        method: 'delete',
    })
}

}

export { CertificatesDates as default }
