import Resource from '../../../api/resource';
import request from '../../../utils/request';

class User extends Resource {
    constructor() {
        super('users');
    }
    getData(id){
        return request({
            url: `/users/${id}`,
            method: 'get',
        })
    }
    setPhoto(payload) {
        return request({
            url: `/archive/update/profile/${payload.id}`,
            method: 'post',
            data: payload.query,
          })
    }
    setAccessControl(payload) {
        return request({
            url: `/users/set/access/${payload.id}`,
            method: 'put',
            data: payload.query,
        })
    }
    addAccessUser(payload) {
        return request({
            url: `/users/access/${payload.id}`,
            method: 'post',
            data: payload.query,
        })
    }
    getAccessUser(id) {
        return request({
            url: `/users/access/${id}`,
            method: 'get'
        })
    }
    resetAccessUser(id) {
        return request({
            url: `/users/access/${id}`,
            method: 'delete'
        })
    }

    profile(){
        return request({
            url: '/users/profile',
            method: 'get'
        })
    }

    export(payload){
        return request({
            url: `/users/export`,
            method: 'post',
            responseType: "blob",
            data:payload
        });
    }
}

export {User as default};
