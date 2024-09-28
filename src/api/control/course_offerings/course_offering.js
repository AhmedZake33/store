import Resource from '../../resource'
import request from '../../../utils/request'

class Offering extends Resource {
    constructor() {
        super('offerings')
    }
    list(query) {
        return request({
            url: `/control/offerings`,
            method: 'post',
            data: query,
        })
    }
    
    //students-grades-pdf/{offering}/{english?}
    exportPDF(payload) {
        return request({
            url: `/control/offerings/students-grades-pdf/${payload.id}/${payload.lang}`,
            //responseType: 'blob',
            method: 'get',
        })
    }
    



}

export { Offering as default }