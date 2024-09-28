import Resource from '../../../api/resource';
import request from '../../../utils/request';

class Theses extends Resource {

    constructor() {
        super('theses');
    }

    myTheses(query) {
        return request({
            url: `/${this.uri}/my`,
            method: 'post',
            data: query,
        })
    }

    addMember(id, query) {
        return request({
            url: `/theses/members${id ? `/${id}` : ''}`,
            method: 'put',
            data: query,
        })
    }

    reorderMembers(id, newOrder) {
        return request({
            url: `/theses/members-reorder/${id}/${newOrder}`,
            method: 'put'
        })
    }

    removeMember(id) {
        return request({
            url: `/theses/member/${id}`,
            method: 'delete',
        })
    }

    register(id) {
        return request({
            url: `/theses/register${id ? `/${id}` : ''}`,
            method: 'put',
        })
    }

    approve(id, query) {
        return request({
            url: `/theses/approve${id ? `/${id}` : ''}`,
            method: 'put',
            data: query,
        })
    }

    discuss(id) {
        return request({
            url: `/theses/discuss${id ? `/${id}` : ''}`,
            method: 'put',
        })
    }

    change(id) {
        return request({
            url: `/theses/change${id ? `/${id}` : ''}`,
            method: 'put',
        })
    }

    undo(id) {
        return request({
            url: `/theses/undo${id ? `/${id}` : ''}`,
            method: 'put',
        })
    }

    printPdf(id) {
        return request({
            url: `/theses/printPdf${id ? `/${id}` : ''}`,
            method: 'get',
            responseType: "blob",
        })
    }

}

export {Theses as default};
