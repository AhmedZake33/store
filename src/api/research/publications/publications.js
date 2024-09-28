import Resource from '../../../api/resource'
import request from '../../../utils/request'

class Publications extends Resource {
    constructor() {
        super('publications')
    }

    list(query) {
        return request({
            url: `/publications/list`,
            method: 'post',
            data: query,
        })
    }

    add(id, query) {
        return request({
            url: `/publications${id ? `/${id}` : ``}`,
            method: 'post',
            data: query,
        })
    }

    get(id){
        return request({
            url: `/publications/${id}`,
            method: 'get',
        })
    }

    update(id, query){
        return request({
            url:`/publications/${id}`,
            method: 'put',
            data: query,
        })
    }

    addMember(id, query) {
        return request({
            url: `/publications/members${id ? `/${id}` : ''}`,
            method: 'put',
            data: query,
        })
    }

    reorderMembers(id, newOrder) {
        return request({
            url: `/publications/members-reorder/${id}/${newOrder}`,
            method: 'put'
        })
    }

    removeMember(id) {
        return request({
            url: `/publications/member/${id}`,
            method: 'delete',
        })
    }

    putFile(id, resource) {
        return request({
            url: `/publications/put-file/${id}`,
            method: 'post',
            data: resource
        })
    }

    syncPublications(payload) {
        return request({
            url: `/publications/sync-publications`,
            method: 'post',
            data: payload
        })
    }
}

export { Publications as default }
