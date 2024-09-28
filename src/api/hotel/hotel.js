import Resource from '../resource'
import request from '../../utils/request'

class Hotels extends Resource {
    
    constructor() {
        super('hotels');
    }
    reservations(payload){
        return request({
            url: 'hotels/reservations',
            method: 'post',
            data : payload.query
        })
    }

    lookups() {
        return request({
            url: 'hotels/lookups',
            method: 'post',
        })
    }

    create(payload){
        return request({
            url: 'hotels/reservations/create',
            method: 'post',
            data: payload
        })
    }

    reservation(id){
        return request({
            url: `hotels/reservation/${id}`,
            method: 'get'
        })
    }

    updateStatus(payload){
        return request({
            url: `hotels/reservation/updateStage/${payload.id}`,
            method: 'post',
            data: payload.query
        }) 
    }

    delete(id){
        return request({
            url: `hotels/reservation/${id}`,
            method: 'delete'
        })
    }
}

export {Hotels as default}