import Resource from '../../../api/resource';
import request from '../../../utils/request';


class Service extends Resource {
    constructor() {
        super('services');
    }
    services(){
        return request({
            url: "services/index",
            method: "get",
        });
    } 
    
    requests(payload){
        return request({
            url : "services/requests",
            method: "post",
            data:payload
        })
    }
    
    getRequest(id){
        return request({
            url : `services/request/${id}` ,
            method :"get"
        })
    }

    updateStatus(payload){
        return request({
            url: `services/updateStatus/${payload.id}`,
            method: "post",
            data: payload.query
        })
    }

    delete(payload){
        return request({
            url : `services/request/${payload.id}`,
            method : 'delete'
        })
    }

}


export {Service as default};