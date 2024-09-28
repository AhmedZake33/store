import Resource from '../../resource'
import request from '../../../utils/request'

class Faculty extends Resource {
  constructor() {
    super('faculties_ems')
  }

  export(payload){
    return request({
      url: `/faculties/export`,
      method: 'post',
      responseType: "blob",
      data:payload,
    });
  }
}

export { Faculty as default }
