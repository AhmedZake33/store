import Resource from '../resource';
import request from '../../utils/request';

class Training extends Resource {
    constructor() {
        super('trainings');
    }

    lookups() {
        return request({
            url: `/trainings/lookups`,
            method: 'get'
        });
    }

    put(id, query) {
        let url = '';
        id != null ? url = `/trainings/${id}` : url = `/trainings`;
        return request({
            url: url,
            method: 'POST',
            data: query,
        })
    }

    students(query) {
        return request({
            url: `/trainings/students`,
            method: 'post',
            data: query,
        });
    }

    studentTraining(training_student_id) {
        return request({
            url: `/trainings/student/${training_student_id}`,
            method: 'post',
        });
    }

    searchForStudent(query) {
        return request({
            url: `/exam-barcodes/search_for_student`,
            method: 'post',
            data: query,
        })
    }

    addStudentToTraining(query) {
        let url = `/trainings/student-to-training`;
        return request({
            url: url,
            method: 'POST',
            data: query,
        })
    }

    updateStudentTrainingStatus(query) {
        let url = '/trainings/update-student-training-status';
        return request({
            url: url,
            method: 'POST',
            data: query,
        })
    }
}

export { Training as default };
