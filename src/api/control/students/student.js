import Resource from '../../resource'
import request from '../../../utils/request'

class controlStudents extends Resource {
    constructor() {
        super('students')
    }

    list(query) {
        return request({
            url: `/control/students`,
            method: 'post',
            data: query,
        })
    }

    finishStudents(query) {
        return request({
            url: `/control/students/finish`,
            method: 'post',
            data: query,
        })
    }

    show_control_student(payload) {
        return request({
            url: `/control/students/${payload.student_id}/${payload.term_id}`,
            method: 'get',
        })
    }

    //term-grades (first tab) student id
    StudentTermGrades(studentId, termId) {
        return request({
            url: `/control/students/term-grades/${studentId}/${termId}`,
            method: 'get',
        })
    }
    UpdateStudentTermGrades(query) {
        return request({
            url: `/control/students/update-term-grades/${query.registration}`,
            method: 'put',
            data: query
        })
    }

    academicTakenCourses(id) {  //student id
        return request({
            url: `/control/students/academic/taken-courses/${id}`,
            method: 'get',
        })
    }

    passedSemesters(id) {  //student id
        return request({
            url: `/control/students/passed-semesters/${id}`, //student id
            method: 'get',
        })
    }

    //students-grades-pdf/{offering}/{english?}
    // exportPDF(payload) {
    //     return request({
    //         url: `/control/offerings/students-grades-pdf/${payload.id}/${payload.lang}`,
    //         //responseType: 'blob',
    //         method: 'get',
    //     })
    // }


}

export {controlStudents as default}
