import Resource from '../../../api/resource';
import request from '../../../utils/request';

class Bylaw extends Resource {
  constructor() {
    super('bylaws_ems');
  }

  export(payload) {
    return request({
      url: `/bylaws/export`,
      method: 'post',
      responseType: 'blob',
      data: payload,
    });
  }

  min_training_weeks(id, query) {
    return request({
      url: `add/training-weeks/${id}`,
      method: 'put',
      data: { min_training_weeks: query },
    });
  }

  min_percentage_final_exam(id, query) {
    return request({
      url: `/add/min-Percentage-final-exam/${id}`,
      method: 'put',
      data: { min_percentage_final_exam: query },
    });
  }

  warning_type(id, query) {
    return request({
      url: `/add/warning-type/${id}`,
      method: 'put',
      data: { warning_type: query },
    });
  }

  exportpdf(payload) {
    return request({
      url: `/bylaws/export/pdf/${payload.id}`,
      method: 'post',
      responseType: 'blob',
    });
  }

  removeGrade(id) {
    return request({
      url: `/bylaw/setting/grade/type${id && '/' + id}`,
      method: 'delete',
    });
  }

  changeStatus(payload) {
    if (!payload.id) return;
    return request({
      url: `/bylaws/add/to/admission${payload.id && '/' + payload.id}`,
      method: 'put',
      data: payload.query,
    });
  }

  setSettings(payload) {
    return request({
      url: `/bylaws/set/Settings/${payload.id}`,
      method: 'put',
      data: payload.query,
    });
  }

  editGrades(payload) {
    if (payload.id == null) {
      return request({
        url: `/bylaw/setting/grade/type`,
        method: 'put',
        data: payload.query,
      });
    } else {
      return request({
        url: `/bylaw/setting/grade/type${payload.id && '/' + payload.id}`,
        method: 'put',
        data: payload.query,
      });
    }
  }

  addSpecialization(id,query){
        return request({
            url: id ? `/specialization/${id}`: `/specialization/store`,
            method: 'post',
            data: query,
        });
    }

    specialization(query){
        return request({
            url: `/specialization/list`,
            method: 'post',
            data: query.query,
        });
    }editGradesRange(payload) {
    if (payload.id == null) {
      return request({
        url: `/bylaw/setting/grade/range`,
        method: 'put',
        data: payload.query,
      });
    } else {
      return request({
        url: `/bylaw/setting/grade/range${payload.id && '/' + payload.id}`,
        method: 'put',
        data: payload.query,
      });
    }
  }

  setSuccessGrades(payload) {
    return request({
      url: `/bylaw/setting/grade/set/success/grades/${payload.grade_id}`,
      method: 'post',
      data: payload
    });
  }

  removeSuccessGrades(id) {
    return request({
      url: `/bylaw/setting/grade/remove/success/grades/${id}`,
      method: 'post',
    });
  }

  save_level(payload) {
    return request({
      url: `/bylaws/bylaw/level${payload.id ? `/${payload.id}` : ''}`,
      method: 'put',
      data: payload.query,
    });
  }

  syncRequirement(payload) {
    return request({
      url: `/bylaws/sync/requirements/${payload.id}`,
      method: 'post',
      data: payload.query,
    });
  }

  delete_level(id) {
    return request({
      url: `/bylaws/bylaw/level/${id}`,
      method: 'delete',
    });
  }
    delete_specialization(id) {
        return request({
            url: `/specialization/delete/${id}`,
            method: 'delete',
        });
    }
    updateSpecialization(query,id) {
        return request({
            url: `/specialization/${id}`,
            method: 'post',
            data: query,
        });
    }
  removeRangeGrades(id) {
    return request({
      url: `/bylaw/setting/grade/range/${id}`,
      method: 'delete',
    });
  }

  saveSemesterGrades(payload) {
    return request({
      url: `/bylaw/setting/grade/update/semester/${payload.id}`,
      method: 'post',
      data: payload.query,
    });
  }

  programsTree(bylaw_id) {
    if (!bylaw_id) return;
    return request({
      url: `/bylaws/bylaw_programs_tree/${bylaw_id}`,
      method: 'post',
    });
  }

    saveProgramsTree(payload) {
        if (!payload.bylaw_id)
            return
        return request({
            url: `/bylaws/bylaw_programs_tree/save/${payload.bylaw_id}`,
            method: 'post',
            data: payload,
        });
    }
    exportDataExcel(payload) {
        return request({
            url: `/bylaws/export-excel`,
            method: 'post',
            responseType: "blob",
            data: payload,
        });
    }
    gradesVisibility(id, query){
      return request({
          url: `/bylaws/grades_visibility/${id}`,
          method: 'put',
          data: query,
      });
  }
}

export { Bylaw as default };
