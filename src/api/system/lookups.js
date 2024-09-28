import Resource from '../resource';
import request from '../../utils/request';

class Lookup extends Resource {
  constructor() {
    super('lookup');
  }

  get(payload){
    return request({
      url: '/lookups/get',
      method: 'post',
      data:payload
    });
  }

  faculty(){
    return request({
      url: '/dashboard/faculty',
      method: 'post'
    });
  }

  Activities(){
    return request({
      url: '/dashboard/activities',
      method: 'post'
    });
  }


  paymentPerMonth(){
    return request({
      url: '/dashboard/payment',
      method: 'post'
    });
  }


  




 
}

export { Lookup as default };
