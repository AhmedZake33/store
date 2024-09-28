import Resource from '../../../api/resource';
import request from "../../../utils/request";

class Roles extends Resource {
    constructor() {
        super('roles');
    }

    userRoleAndPermissions(user_id) {
        return request({
            url: `/roles/user/${user_id}`,
            method: 'post',
        })
    }

    updatePermission(id , resource) {
        return request({
            url: `/roles/permission/update/${id}`,
            method: 'put',
            data: resource,
        })
    }

    updateUserRoleAndPermissions(resource, user_id) {
        return request({
            url: `/roles/user/${user_id}`,
            method: 'put',
            data: resource,
        })
    }

}

export {Roles as default};
