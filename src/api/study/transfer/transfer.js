import Resource from '../../resource'
import request from '../../../utils/request'

class Transfer extends Resource {
  constructor() {
    super('transfer')
  }

  getInternalStudentData(payload) {
    return request({
      url: `/transfer/internal/${payload.id}`,
      method: 'get',
      data: payload.query
    })
  }

  addExternalTransferInfo(payload) {
    return request({
      url: `/transfer/external/add-external/${payload.id}`,
      method: 'post',
      data: payload.query
    })
  }

  getTransferAvailableCourses(payload) {
    return request({
      url: `/transfer/internal/courses-equivalent/${payload.id}`,
      method: 'get'
    })
  }

  getProgramCourses(payload) {
    return request({
      url: `/transfer/internal/${payload.id}/program-courses`,
      method: 'post',
      data: payload.query
    })
  }

  addTransferTempCourse(payload) {
    return request({
      url: `/transfer/internal/temp-courses/add/${payload.id}`,
      method: 'post',
      data: payload.query
    })
  }

  getTransferTempCourses(transfer_id) {

    return request({
      url: `/transfer/internal/temp-courses/${transfer_id}`,
      method: 'get'
    })
  }

  getTempCourseEquivalenceDetails(payload) {
    return request({
      url: `/transfer/internal/temp-courses/${payload.id}/details/${payload.related_course_id}`,
      method: 'get'
    })
  }

  executeStudentTransfer(payload) {
    return request({
      url: `/transfer/internal/${payload.id}`,
      method: 'put'
    })
  }

  rejectTransferRequest(payload) {
    return request({
      url: `/transfer/internal/${payload.transfer_id}/reject`,
      method: 'put',
      data: payload.query
    })
  }

  listAllTransferRequests(query) {
    return request({
      url: `/transfer/internal/list`,
      method: 'post',
      data: query
    })
  }

  showInternalDetails(payload) {
    return request({
      url: `/transfer/internal/details/${payload.transfer_id}`,
      method: 'get',
    })
  }

  transferLookups(payload) {
    if (payload.student_id) {
      return request({
        url: `/transfer/internal/${payload.student_id}/lookup`,
        method: 'post',
        data: payload.query
      })
    } else {
      return request({
        url: `/transfer/lookups/get`,
        method: 'post',
        data: payload.query
      })
    }
  }

  editTransfer(payload) {
    return request({
      url: `/transfer/internal/${payload.transfer_id}/edit`,
      method: 'post',
      data: payload.query

    })
  }

  //external transfer APIs
  getExternalStudentData(payload) {
    return request({
      url: `/transfer/external/${payload.id}`,
      method: 'get'
    })
  }

  editCourses(payload) {
    return request({
      url: `/students/equivalence/${payload.applicant_id ? payload.applicant_id : payload.student_id}/edit-courses`,
      method: 'put',
      data: payload
    })
  }

  addAbroadStudyCourse(payload) {
    return request({
      url: `/transfer/external/add_study_abroad_course`,
      method: 'post',
      data: payload
    })
  }

  getExternalStudentCourses(payload) {
    return request({
      url: `/transfer/external/courses-equivalent/${payload.id}`,
      method: 'get'
    })
  }

  getExternalProgramCourses(payload) {
    return request({
      url: `/transfer/external/${payload.id}/program-courses`,
      method: 'post',
      data: payload.query
    })
  }

  getExternalTempCourseEquivalenceDetails(payload) {
    return request({
      url: `/transfer/external/external-temp-courses/${payload.id}/details/${payload.related_course_id}`,
      method: 'get'
    })
  }

  addExternalTransferTempCourse(payload) {
    return request({
      url: `/transfer/external/temp-courses/add/${payload.id}`,
      method: 'post',
      data: payload.query
    })
  }

  getExternalTransferTempCourses(user_id) {
    return request({
      url: `/transfer/external/temp-courses/${user_id}`,
      method: 'get'
    })
  }

  executeStudentExternalTransfer(payload) {

    if (payload.type === 'student') {
      return request({
        url: `/students/equivalence/${payload.id}`,
        method: 'put'
      })
    } else {
      return request({
        url: `/transfer/external/${payload.id}`,
        method: 'put'
      })
    }
  }

  SendRequest(query) {
    return request({
      url: `/transfer/internal/${query.student_id}/add`,
      method: 'post',
      data: query,
    })
  }

  deleteTransfer(id) {
    return request({
      url: `/transfer/${id}/delete`,
      method: 'post'
    })
  }
}

export { Transfer as default }
