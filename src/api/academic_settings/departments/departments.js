import Resource from '../../resource'
import request from '../../../utils/request'

class Department extends Resource {
  constructor() {
    super('departments_ems')
  }

  export(payload){
    return request({
      url: `/departments/export`,
      method: 'post',
      responseType: "blob",
      data:payload,

    });
  }

  exportMigrationTemplate() {
    return request({
      url: `/departments/export_migrated_departments_template`,
      method: 'post',
      responseType: "blob",
    });
  }
}

export { Department as default }
