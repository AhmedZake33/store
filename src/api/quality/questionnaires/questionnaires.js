import Resource from '../../../api/resource';
import request from '../../../utils/request';

class Questionnaires extends Resource {
    constructor() {
        super('questionnaires');
    }

    offeringQuestionnaires(query) {
        return request({
            url: `/questionnaires/offering/questionnaires`,
            method: 'post',
            data: query
        })
    }

    get(id) {
        return request({
            url: `/questionnaires/show/${id}`,
            method: 'get',
        })
    }

    getActiveQuestionnaires() {
        return request({
            url: `/questionnaires/user`,
            method: 'get',
        })
    }

    getQuestions(id) {
        return request({
            url: `/questionnaires/get_questions/${id}`,
            method: 'get',
        })
    }

    submit(id, payload) {
        return request({
            url: `/questionnaires/submit/${id}`,
            method: 'put',
            data: payload,
        })
    }

    changeStatus(id) {
        return request({
            url: `/questionnaires/survey/status/${id}`,
            method: 'get',
        })
    }

    getQuestionnaireStatistics(id,query) {
        return request({
            url: `/questionnaires/stats/${id}`,
            method: 'post',
            data: query
        })
    }

    getQuestionnaireLookups(payload) {
      return request({
            url: `/questionnaires/questionnaires/lookups`,
            method: 'post',
            data: payload
        })
    }

    getUsersAnswers(id) {
        return request({
            url: `/questionnaires/participants/${id}`,
            method: 'get',
        })
    }
}   

export {Questionnaires as default};
