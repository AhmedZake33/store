import Resource from '../../resource'
import request from '../../../utils/request'

class Section extends Resource {
  constructor() {
    super('sections')
  }
//edit section
  put(id, query) {
    return request({
        url: `/${this.uri}${id ? `/${id}` : ''}`,
        method: 'put',
        data: query,
    })
}
  add(query) {
    return request({
        url: `/${this.uri}`,
        method: 'put',
        data: query,
    })
}
//Add Multi or single section 
  addSection(query) {
    return request({
        url: '/sections/add',
        method: 'post',
        data: query,
    })
}

}

export { Section as default }
