import Resource from '../../resource'
import request from '../../../utils/request'

class courseFile extends Resource {
    constructor() {
        super('getOffer');
    }
    exportData(lang, query = {}) {
        return request({
            url: `/getOffer/export-excel/${lang}`,
            responseType: 'blob',
            method: 'get',
            params: query,
        })
    }
    GetCount(query) {
        return request({
            url: '/count',
            method: 'get',
        })
    }
    GetComment(resourse) {
        return request({
            url: `/getComment/${resourse.id}`,
            method: 'get',
            data:resourse.query1,
        })
    }
    GetAllComment(id) {
        return request({
            url: `/getAllComment/${id}`,
            method: 'get',
        })
    }
    postComment(resourse) {
        return request({
            url: `/postComment/${resourse.id}`,
            method: 'post',
            data: resourse,
        })
    }
    checkArchive(id) {
        return request({
            url: `/checkArchive/${id}`,
            method: 'get',
        })
    }
    changeStatu(id) {
        return request({
            url: `/changeQualityStatus/${id}/submit`,
            method: 'post',
           
        })
    }
    updateStatu(id) {
        return request({
            url: `/changeQualityStatus/${id}/update`,
            method: 'post',
           
        })
    }
    accStatu(id) {
        return request({
            url: `/changeQualityStatus/${id}/accept`,
            method: 'post',
            
        })
    }
    notAccStatu(id) {
        return request({
            url: `/changeQualityStatus/${id}/notAccept`,
            method: 'post',
         
        })
    }
    approve(id) {
        return request({
            url: `/changeQualityStatus/${id}/approve`,
            method: 'post',
         
        })
    }
    notApprove(id) {
        return request({
            url: `/changeQualityStatus/${id}/notApprove`,
            method: 'post',
         
        })
    }
    undo(resourse) {
        return request({
            url: `/undo/${resourse.id}/${resourse.quality}`,
            method: 'post',
         
        })
    }
}
export { courseFile as default }
