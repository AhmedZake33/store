import Resource from '../../resource'
import request from '../../../utils/request'
import {getAuth} from "@/auth/utils";

class OfferingsRegistration extends Resource {
  constructor() {
    super('registrations')
  }

  getSelectedCourses(id,payload) {
    let baseUrl = `${this.uri}/students/requested-offerings`;
    if (id) {
      baseUrl += `/${id}`;
    }
    return request({
      url: baseUrl,
      method: 'get',
      params: payload,
    })
  }

  getCurrentTermStage(id) {
    let baseUrl = `${this.uri}/students/available-termstages`;
    if (id) {
      baseUrl += `/${id}`;
    }
    return request({
      url: baseUrl,
      method: 'get',
    })
  }

  getAvailableCourses(id,payload) {
    let baseUrl = `${this.uri}/students/available-offerings`;
    if (id) {
      baseUrl += `/${id}`;
    }
    return request({
      url: baseUrl,
      method: 'get',
      params: payload,
    })
  }

  offeringSections(payload) {
    return request({
      url: `${this.uri}/students/offering-sections/${payload.offering_id}`,
      method: 'get',
      params: payload,
    })
  }

  requestNewOffering(payload) {
    return request({
      url: `${this.uri}/students/request-offering`,
      method: 'put',
      data: payload,
    })
  }

  changeOfferingSection(payload) {
    return request({
      url: `${this.uri}/students/update-section-offering`,
      method: 'put',
      data: payload,
    })
  }

  studentRegistrationTerms(id) {
    return request({
      url: `${this.uri}/students/${id}/terms`,
      method: 'get',
    })
  }

  removeRequestedOffering(payload) {
    return request({
      url: `${this.uri}/students/remove-offering`,
      method: 'put',
      data: payload,
    })
  }

  acceptRequestedOffering(payload) {
    return request({
      url: `${this.uri}/students/accept-requested-offering`,
      method: 'put',
      data: payload,
    })
  }

  rejectRequestedOffering(payload) {
    return request({
      url: `${this.uri}/students/reject-requested-offering`,
      method: 'put',
      data: payload,
    })
  }

  withdrawRequestedOffering(payload) {
    return request({
      url: `${this.uri}/students/withdraw-offering`,
      method: 'put',
      data: payload,
    })
  }

  addDropRequestedOffering(payload) {
    return request({
      url: `${this.uri}/students/addDrop-offering`,
      method: 'put',
      data: payload,
    })
  }

  undoToRegisteredOffering(payload) {
    return request({
      url: `${this.uri}/students/undo-registered-offering`,
      method: 'put',
      data: payload,
    })
  }

  acceptAllRequestedOfferings(payload) {
    return request({
      url: `${this.uri}/students/accept-all-requested-offerings`,
      method: 'put',
      data: payload,
    })
  }

  updateStatusOffering(status, payload) {
    return request({
      url: `${this.uri}/students/update-status/${status}`,
      method: 'put',
      data: payload,
    })
  }

  export(payload) {
    return request({
        url: `/advisor-students/export`,
        method: 'post',
        responseType: "blob",
        data: payload,
    });
}

  getAdvisingStudents(payload) {
    return request({
      url: `${this.uri}/advisor-students`,
      method: 'get',
      params: payload,
    })
  }

  lookup(payload) {
    return request({
      url: '/lookups/get',
      method: 'post',
      data: payload,
    })
  }

  printData(payload) {
    return request({
      url: `${this.uri}/students/export-registration/${payload.student_id}/${payload.lang}`,
      responseType: 'blob',
      method: 'get',
    })
  }
  getTermsGrades(payload){
    let url = `/students/${payload.student_id}/terms_grades`;
    if(payload.student_id == getAuth().id){
      url = '/students/terms_grades';
    }
    return request({
      url: url,
      method: 'get',
    })
  }

  getTakenCourses(payload){
    let url = `/students/${payload.student_id}/courses_history`;
    if(payload.student_id == getAuth().id){
      url = '/students/courses_history';
    }
    return request({
      url: url,
      method: 'get',
    })
  }

  getStudyPlan(payload) {
    let url = `/students/${payload.student_id}/study-plan`;
    return request({
      url: url,
      method: 'get',
    })
  }
}

export { OfferingsRegistration as default }
