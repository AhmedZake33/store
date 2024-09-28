import Resource from '../../resource'
import request from '../../../utils/request'

class gradesRecheck extends Resource {
    constructor() {
        super('grades-recheck')
    }

    updateStatus(id, query) {
        return request({
            url:`grades-recheck/update-status/${id}`,
            method: 'post',
            data: query
        })
    }
}

export { gradesRecheck as default }