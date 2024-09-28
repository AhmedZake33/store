import Resource from '../../resource';
import request from '../../../utils/request';

class Tag extends Resource {
    constructor() {
        super('tags');
    }

    put(id, query) {
        return request({
            url: `/tags/create${id?'/'+id:''}`,
            method: 'post',
            data: query,
        })
    }
}

export {Tag as default};
