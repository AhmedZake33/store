import Resource from '../../resource';
import request from '../../../utils/request';
import store from '@/store/index';

class PaymentItems extends Resource {
  constructor() {
    super('payment/items');
  }
  list(id, query) {
    return request({
      url: `/${this.uri}/${id}`,
      method: 'post',
      data: query
    })
  }
  put(id, query) {
    return request({
      url: `/${this.uri}/edit/${id}`,
      method: 'put',
      data: query,
    })
  }

  editPaymentItem(id,query){
      return request({
          url: `payment/items/edit_amount/${id}`,
          method: 'put',
          data: query,
      })
  }

  paymentRefundItems(id,query){
    return request({
        url: `payment/items/show_item/${id}`,
        method: 'get',
        data: query,
    })
  }
}

export { PaymentItems as default } ;
