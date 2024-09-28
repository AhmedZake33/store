import Resource from '../../resource';
import request from '../../../utils/request';
import store from '@/store/index'

class Payment extends Resource {
    constructor() {
        super('payments_ems');
    }

    createPayment(id,query){
      return request({
            url: `payments/create_payment/${id}`,
            method: 'post',
            data: query,
        })
    }

    putTransaction(id, query) {
        let url = '';
        id != null ? url = `/transactions/put/${id}` : url = `/transactions/put`;
        return request({
            url: url,
            method: 'post',
            data: query,
            onUploadProgress: function (progressEvent) {
                store.commit('app/SET_UPLOAD_PROGRESS', parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100)))
            }.bind(store),
        })
    }

    refund(query, id) {
        return request({
            url: id ? `payments/refund/${id}` : `payments/refund`,
            method: 'post',
            data: query,
            onUploadProgress: function (progressEvent) {
                store.commit('app/SET_UPLOAD_PROGRESS', parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100)))
            }.bind(store),
        })
    }

    history(id){
        return request({
            url: `payments/history/${id}`,
            method: 'post'
        })
    }

    editDueDate(id,query){
        return request({
            url: `payments/due_date/${id}`,
            method: 'put',
            data: query,
        })
    }

    createInstallments(payment_id, id , query){
        return request({
            url: id ? `installments/${payment_id}/${id}?_method=PUT` : `installments/${payment_id}?_method=PUT`,
            method: 'post',
            data: query,
        })
    }
    createPaymentOrder(payment_id, query){
        return request({
            url: `payments/export-payment-order/${payment_id}`,
            method: 'post',
            data: query,
        })
    }

    removeInstallment(id) {
        return request({
            url: `installments/${id}`,
            method: 'delete',
        })
    }

    importPayments(query){
        return request({
            url: `payments/batches/import_preview`,
            method: 'post',
            data: query,
        })
    }

    submitFile(id){
        return request({
            url: `payments/batches/import_save/${id}`,
            method: 'post',
        })
    }

    batches(){
        return request({
            url: `payments/batches`,
            method: 'post'
        })
    }

    getBatch(id){
        return request({
            url: `payments/batches/${id}`,
            method: 'post'
        })
    }

    directCashback(id, query) {
        return request({
            url: `payments/direct_cash_back/${id}`,
            method: 'post',
            data: query,
        })
    }

    scholarship(id, query) {
        return request({
            url: `payments/scholarship/${id}`,
            method: 'post',
            data: query,
        })
    }

    exportPaymentInvoice(id) {
        return request({
            url: `payments/export_pdf${id ? `/${id}` : ''}`,
            method: 'get',
            responseType: "blob",
        })
    }

    deleteBatch(id){
        return request({
            url: `payments/batches/delete/${id}`,
            method: 'post'
        })
    }

    checkPayment(id){
        return request({
            url: `payments/checkPayment/${id}`,
            method: 'post'
        })
    }

    exportData(query) {
        return request({
            url: `/payments/export_pdf`,
            method: 'post',
            data: query,
            responseType: "blob",
        })
    }

    exportDataExcel(query) {
        return request({
            url: `/payments/export_excel`,
            method: 'post',
            data: query,
            responseType: "blob",
        })
    }

    invoicesReport(query) {
        return request({
            url: `/payments/invoices-report`,
            method: 'post',
            data: query,
            responseType: "blob",
        })
    }

    submitScholarshipForm(id , query){
        return request({
              url: `students/scholarships/apply-scholarship/${id}`,
              method: 'post',
              data: query,
          })
      }

}

export {Payment as default};
