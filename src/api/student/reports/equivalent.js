import Resource from '../../../api/resource';
import request from '../../../utils/request';

class EquivalentReport extends Resource {
    constructor() {
        super('equivalent');
    }

    list(type,query) {
        return request({
            url: `/reports/equivalent/${type}`,
            method: 'post',
            data: query,
        })
    }

    export(type,payload){
      return request({
          url: `/equivalent/export/${type}`,
          method: 'post',
          responseType: "blob",
          data:payload
        });
    }

    print(type,payload){
        return request({
            url: `/reports/equivalent/print/${type}`,
            method: 'post',
            responseType: "blob",
            data:payload
        });
    }
}

export {EquivalentReport as default};
