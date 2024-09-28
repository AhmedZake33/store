import Resource from '../../api/resource';
import request from '../../utils/request';

class Dashboard extends Resource {
  constructor() {
    super('dashboard');
  }

  counts(){
    return request({
      url: '/dashboard/counts',
      method: 'post'
    });
  }

  faculty(){
    return request({
      url: '/dashboard/faculty',
      method: 'post'
    });
  }

  
  offering_statistics(id) {
    return request({
      url: `/offerings/statistics/${id}`,
      method: 'get',
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

export { Dashboard as default };
