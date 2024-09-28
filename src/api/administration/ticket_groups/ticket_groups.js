import Resource from '../../resource'
import request from '../../../utils/request'

class TicketGroups extends Resource {
  constructor() {
    super('ticket-groups')
  }

  list(query) {
    return request({
      url: `/${this.uri}/groups`,
      method: 'get',
      params: query,
    })
  }
  edit(resource) {
    return request({
      url: `/${this.uri}/${resource.id}`,
      method: 'post',
      data: resource,
    })
  }
  put(id, payload) {
    return request({
      url: `/${this.uri}/${id}`,
      method: 'put',
      data: payload,
    })
  }

  post(payload) {
    return request({
      url: `/${this.uri}`,
      method: 'post',
      data: payload,
    })
  }

  get(id) {
    return request({
      url: `/${this.uri}/${id}`,
      method: 'get',
    })
  }
}

export { TicketGroups as default }
