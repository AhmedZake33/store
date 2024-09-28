import Resource from '../../../api/resource';
import request from '../../../utils/request';

class Certificate extends Resource {
    constructor() {
        super('certificates');
    }

    put(id, query) {
        let url='';
        id != null ? url=`/certificates/upload/${id}` : url = `/certificates/upload`;
        return request({
            url: url,
            method: 'POST',
            data: query,
        })
    }

    updateStudent(data) {
        return request({
            url: `certificates/graduate/request/${data.id}`,
            method: "post",
            data:data.query,
        });
    }

    checkBankMisrPaymentStatus(data) {
        return request({
            url: `certificates/students/payment/check/${data.transaction}`,
            method: "post",
        });
    }


    changeName(data){
        return request({
            url:`certificates/changeName/${data.id}`,
            method:"post",
            data:data.query
        })
    }

}

export {Certificate as default};
