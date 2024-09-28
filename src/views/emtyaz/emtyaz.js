import Resource from '../resource'
import request from '../../utils/request'

class Emtyaz extends Resource {
    constructor() {
        super('emtyaz');
    }
    courses(payload){
        return request({
            url: 'emtyaz/courses',
            method: 'post',
            data : payload.query
        })
    }
    offerings(payload){
        return request({
            url: 'emtyaz',
            method: 'post',
            data : payload.query
        })
    }
    getSelectedEmtyaz(payload) {
        let baseUrl = `${this.uri}/student_registration/${payload.id}`;
        return request({
          url: baseUrl,
          method: 'get',
        })
    }
    acceptRequestedEmtyaz(payload) {
        return request({
          url: `${this.uri}/course/accept_emtyaz`,
          method: 'put',
          data: payload,
        })
    }
    removeRequestedEmtyaz(payload) {
        return request({
          url: `${this.uri}/course/remove_emtyaz`,
          method: 'put',
          data: payload,
        })
    }
    addTrainingEmtyaz(payload) {
        return request({
          url: `${this.uri}/course/add_emtyaz`,
          method: 'put',
          data: payload,
        })
    }
    getAvailableTrainings(payload) {
        let baseUrl = `${this.uri}/available-training`;
        if (payload.id) {
          baseUrl += `/${payload.id}`;
        }
        return request({
          url: baseUrl,
          method: 'post',
          data: payload.payload,
        })
      }
    rejectRequestedEmtyaz(payload) {
        return request({
          url: `${this.uri}/course/reject_emtyaz`,
          method: 'put',
          data: payload,
        })
    }
    acceptAllRequestedEmtyaz(payload) {
        return request({
          url: `${this.uri}/accept_all_requested`,
          method: 'put',
          data: payload,
        })
    }
    trainings(payload){
        return request({
            url: 'emtyaz/training_types',
            method: 'post',
            data : payload.query
        })
    }
    registrations(payload){
        return request({
            url: 'emtyaz/registration',
            method: 'post',
            data : payload.query
        })
    }
    getCourse(id){
        return request({
            url: 'emtyaz/getCourse/'+id,
            method: 'get',
        })
    }
    putCourse(payload){
        let url = '';
        payload.id != null? url='emtyaz/course/putCourse/'+payload.id : url='emtyaz/course/putCourse';
        return request({
            url:url,    
            method: 'post',
            data : payload.course
        })
    }
    putTrainingType(payload){
        let url = '';
        payload.id != null? url='emtyaz/course/putTrainingType/'+payload.id : url='emtyaz/course/putTrainingType';
        return request({
            url:url,    
            method: 'post',
            data : payload.course
        })
    }
    lookup(payload){
        return request({
            url: `/lookups/get`,
            method: 'post',
            data:payload
          });
    }
    deleteTraining(payload){
        return request({
            url:'emtyaz/course/deleteTraining/'+payload.id,
            method: 'post',
        })
    }
    deleteTrainingType(payload){
        return request({
            url:'emtyaz/course/deleteTrainingType/'+payload.id,
            method: 'post',
        })
    }
    offering_mark(id) {
        return request({
            url: `/emtyaz/offering-students-grades/${id}`,
            method: 'get',
        })
    }
    updateStudentGradeFromExcel(resource) {
        return request({
            url: '/emtyaz/offering-grades/update',
            data: resource,
            method: 'put',
        })
    }
    statusSubmit(id){
        return request({
            url: `/emtyaz/submit-control-status/${id}`,
            method: 'put',
        })
    }
}
export {Emtyaz as default}