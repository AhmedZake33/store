import Resource from '../../resource';
import request from '../../../utils/request';

class Credit extends Resource {
    constructor() {
        super('credits');
    }

    cashback(id,query){
        return request({
            url: `payments/cash_back/${id}`,
            method: 'post',
            data: query,
        })
    }

    chargeWallet(query){
        query.id = parseInt(query.id) 
        return request({
            url: `credits/charge-credit`,
            method: 'post',
            data: query,
        })
    }
}

export {Credit as default};
