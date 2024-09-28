import Resource from '../resource'
import request from '../../utils/request'

class Ticket extends Resource {
  constructor() {
    super('tickets')
  }

  list(resource, query) {
    return request({
      url: `/${this.uri}/${resource}`,
      method: 'get',
      params: query,
    })
  }
  edit(resource) {
    return request({
      url: `/${this.uri}/${resource.id}`,
      method: 'get',
      params: resource,
    })
  }
  add(query) {
    return request({
      url: `/${this.uri}`,
      method: 'post',
      data: query,
    })
  }

  lookup(payload) {
    return request({
      url: `/${this.uri}test`,
      method: 'post',
      data: payload,
    })
  }

  get(id){
    return request({
      url: `/${this.uri}/${id}`,
      method: 'get',
    })
  }

  update(payload){
    return request({
      url:`/${this.uri}/update/${payload.id}`,
      method: 'post',
      data: payload.query,
    })
  }

  updateStatus(payload){
    return request({
      url: `/${this.uri}/${payload.id}/update-status`,
      method: 'put',
      data: payload.query,
    })
  }

  updateGroup(payload){
    return request({
      url: `/${this.uri}/${payload.id}/update-group`,
      method: 'put',
      data: payload.query,
    })
  }

  getTicketHistory(id){
    return request({
      url: `/${this.uri}/${id}/ticket-history`,
      method: 'get',
    })
  }
}

export { Ticket as default }
