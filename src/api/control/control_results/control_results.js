import Resource from '../../resource'
import request from '../../../utils/request'

class ControlResults extends Resource {
    constructor() {
        super('control-results')
    }
     
    controlLookups(payload) {
        return request({
            url: `/control/offerings/reports/lookup`,
            method: 'post',
            data: payload,            
        })
    }

    getControlResult(payload){
        return request({
            url: `/control/offerings/reports/control-results`,
            method: 'get',
            params: payload,
            
        })
    }
    



}

export { ControlResults as default }