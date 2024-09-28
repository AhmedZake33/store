import Resource from '../resource'
import request from '../../utils/request'

class Year extends Resource {
  constructor() {
    super('years')
  }

  getPayments(yearId, type, params = {}) {
    return request({
      url: `/${this.uri}/${yearId}/payments/${type}`,
      method: 'get',
      params,
    })
  }

  updatePayments(id, type, data = {}) {
    return request({
      url: `/${this.uri}/${id}/payments/${type}`,
      method: 'put',
      data,
    })
  }

  getPaymentSetting(yearId, paymentSettingId, params = {}) {
    return request({
      url: `/${this.uri}/${yearId}/payments/payment-settings/${paymentSettingId}`,
      method: 'get',
      params,
    })
  }

  updatePaymentSetting(yearId, paymentSettingId, data = {}, params= {}) {
    let url = `/${this.uri}/${yearId}/payments/payment-settings`
    let method = 'post'
    url += `/${paymentSettingId}`

    if (Number.isInteger(paymentSettingId)) {
      method = 'put'
    }
    return request({
      url,
      method,
      data,
      params,
    })
  }

  removePaymentSetting(yearId, paymentSettingId, params) {
    return request({
      url: `/${this.uri}/${yearId}/payments/payment-settings/${paymentSettingId}`,
      method: 'delete',
      //params,
    })
  }

  getPaymentAccounts(yearId, data = {}) {
    return request({
      url: `/${this.uri}/${yearId}/payments/payment-accounts`,
      method: 'get',
      params: data,
    })
  }

  updatePaymentAccount(yearId, accountId, data = {}) {
    let url = `/${this.uri}/${yearId}/payments/payment-accounts`
    let method = 'post'
    if (accountId) {
      url += `/${accountId}`
      method = 'put'
    }
    return request({
      url,
      method,
      data,
    })
  }

  removePaymentAccount(yearId, accountId) {
    return request({
      url: `/${this.uri}/${yearId}/payments/payment-accounts/${accountId}`,
      method: 'delete',
    })
  }

  getPaymentSettingsLookUp(params) {
    const url = '/test/year/lookups'
    return request({
      url,
      method: 'get',
      params,
    })
  }

  getTuitionPaymentAccounts(yearId, type, data = {}) {
    return request({
      url: `/${this.uri}/${yearId}/payments/${type}/payment-accounts`,
      method: 'get',
      params: data,
    })
  }

  updateTuitionPaymentAccounts(yearId, type, data = {}, params= {}) {
    return request({
      url: `/${this.uri}/${yearId}/payments/${type}/payment-accounts`,
      method: 'put',
      data,
      params,
    })
  }

  editDueDate(yearId, type, query) {
    return request({
      url: `/${this.uri}/${yearId}/payments/${type}/due-date`,
      method: 'post',
      data: query,
    })
  }

  getScholarship(yearId, query) {
    return request({
      url: `/${this.uri}/${yearId}/payments/scholarship`,
      method: 'get',
      params: query,
    })
  }

  getAutomaticScholarship(yearId, query) {
    return request({
      url: `/${this.uri}/${yearId}/payments/get-automatic-scholarship`,
      method: 'get',
      params: query,
    })
  }

  updateScholarship(yearId, scholarshipId, data = {}) {
    let url = `/${this.uri}/${yearId}/payments/edit-scholarship/${scholarshipId}`
    let method = 'post'
    return request({
      url,
      method,
      data,
    })
  }

  updateGradesRangeScolarship(yearId, scholarshipId, data = {}) {
    let url = scholarshipId ?  `/${this.uri}/${yearId}/payments/edit-Auto-scholarship/${scholarshipId}` : `/${this.uri}/${yearId}/payments/create-Auto-scholarship`
    let method = 'post'
    return request({
      url,
      method,
      data,
    })
  }

  addScholarship(yearId, data = {}) {
    let url = `/${this.uri}/${yearId}/payments/create-scholarship`
    let method = 'post'
    return request({
      url,
      method,
      data,
    })
  }

  removeScholarship(yearId, scholarshipId, payment_setting_scholarship_id) {
    return request({
      url: `/${this.uri}/${yearId}/payments/delete-scholarship/${scholarshipId}`,
      method: 'delete',
      data: {payment_setting_scholarship_id: payment_setting_scholarship_id}
    })
  }

  saveDueDates(payload){
    return request({
      url:`/${this.uri}/${payload.yearId}/payments/due-dates/${payload.type}${payload.id?`/${payload.id}`:''}`,
      method: "post",
      data: payload.query
    })
  }

  getDueDates(yearId){
    return request({
      url:`/${this.uri}/${yearId}/payments/due-dates`,
      method: "get",
    })
  }

}
export { Year as default }
