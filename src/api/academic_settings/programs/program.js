import Resource from '../../../api/resource';
import request from '../../../utils/request';

class Program extends Resource {
    constructor() {
        super('programs_ems');
    }

    sync(id, query) {
        return request({
            url: `/programs/sync/${id}`,
            method: 'put',
            data: query
        });
    } 
    getStudyPlan(payload) {
        let url = `/programs/study-plan/${payload.id}`;
        return request({
          url: url,
          method: 'get',
        })
    }
    saveResearchPlan(payload) {
        return request({
            url: `/programs/research-plan${payload.id ? `/${payload.id}` : ''}`,
            method: 'post',
            data: payload.query
        });
    }
    saveResearchPlan(payload) {
        return request({
            url: `/programs/research-plan${payload.id ? `/${payload.id}` : ''}`,
            method: 'post',
            data: payload.query
        });
    }
    save_pool(id, query) {
        return request({
            url: `/programs/program/pool${id ? `/${id}` : ''}`,
            method: 'put',
            data: query
        });
    }

    delete_pool(id) {
        return request({
            url: `/programs/program/pool/${id}`,
            method: 'delete'
        });
    }

    update(id, query) {
        return request({
            url: `/programs/program/course/${id}`,
            method: 'put',
            data: query
        });
    }

    delete(id) {
        return request({
            url: `/programs/program/course/${id}`,
            method: 'delete',
        });
    }

    deletePorgramCourse(payload) {
        return request({
            url: `/programs/program/delete-program-course/${payload.program_id}`,
            method: 'delete',
            data: payload,
        });
    }

    export(payload) {
        return request({
            url: `/programs/export`,
            method: 'post',
            responseType: "blob",
            data: payload
        });
    }

    setGeneral(id){
        return request({
            url: "/programs/make-general/"+id,
            method:"POST",
        })
    }

    saveProgramPrerequisiteCourses(payload) {
        if (!payload.program_id)
            return
        return request({
            url: `/programs/sync/prerequisite_courses/${payload.program_id}`,
            method: 'post',
            data: payload,
        });
    }

    updateCourseSemester(id, query) {
        return request({
            url: `/programs/program/course/semester/${id}`,
            method: 'put',
            data: query
        });
    }

    updateRequirements(program_id, type , id , query) {
        return request({
            url: `/programs/university_faculty_requirements/${program_id}/${type}/${id}`,
            method: 'put',
            data: query,
        })
    }
}

export {Program as default};
