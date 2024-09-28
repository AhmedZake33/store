import Resource from '../../resource'
import request from '../../../utils/request'

class Projects extends Resource {
  constructor() {
    super('projects')
  }

  list(resource, query) {
    return request({
      url: `/projects/my-projects`,
      method: 'get',
      params: query,
    })
  }

  add(id, query) {
    return request({
      url: `/projects${id ? `/${id}` : ``}`,
      method: 'post',
      data: query,
    })
  }

  get(id) {
    return request({
      url: `/projects/${id}`,
      method: 'get',
    })
  }

  update(id, query) {
    return request({
      url: `/projects/${id}`,
      method: 'put',
      data: query,
    })
  }
}

export {Projects as default}
