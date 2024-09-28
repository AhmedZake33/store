import Resource from '../resource'
import request from '../../utils/request'

class offerings extends Resource {
  constructor() {
    super('work_space')
  }

 

  workspaceOfferings(query) {
    return request({
      url: `/offerings/my-course-offerings`,
      method: 'post',
      data:query,
    })
  }
}
export { offerings as default }
