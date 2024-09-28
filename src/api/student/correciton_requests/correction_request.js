import Resource from '../../resource'
import request from '../../../utils/request'

class CorrectionRequest extends Resource {
  constructor() {
    super('students/correction_request')
  }

  add(query) {
    return request({
      url: `/${this.uri}/add`,
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
      method:'post',
      data:payload.query
    })
  }

}

export { CorrectionRequest as default }
