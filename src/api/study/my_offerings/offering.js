import Resource from '../../resource'
import request from '../../../utils/request'

class Offering extends Resource {
    constructor() {
        super('offerings')
    }

    exportData(lang, query = {}) {
        return request({
            url: `/offerings/export-excel/${lang}`,
            responseType: 'blob',
            method: 'get',
            params: query,
        })
    }



    program_courses(resource) {
        return request({
            url: '/offerings/lookup/program-courses',
            method: 'get',
            params: resource,
        })
    }

    add(query) {
        return request({
            url: '/offerings/add',
            method: 'post',
            data: query,
        })
    }

    put(id, query) {
        return request({
            url: `/offerings/edit/${id}`,
            method: 'put',
            data: query,
        })
    }

    offering_mark(id) {
        return request({
            url: `/offerings/offering-students-grades/${id}`,
            method: 'get',
        })
    }

    exportStudentGrades(id, lang) {
        return request({
            url: `/offerings/export-student-grades/${id}/${lang}`,
            responseType: 'blob',
            method: 'get',
        })
    }

    // import excel file
    upload(resource, id, lang) {
            return request({
                url: `/offerings/import-student-grades/${id}/${lang}`,
                method: 'post',
                headers: { 'Content-Type': 'multipart/form-data' },
                data: resource,
            })
        }
        // submit imported excel file
    submitImportedExcel(payload) {
        return request({
            url: `/offerings/submit-student-grades/${payload.id}/${payload.lang}`,
            method: 'post',
            data:payload.query
        })
    }

    updateStudentGradeFromExcel(resource) {
        return request({
            url: 'offerings/offering-students-grades/update',
            data: resource,
            method: 'put',
        })
    }
    addMultiSections(id, query) {
        return request({
            url: `/offerings/generate-sections/${id}`,
            method: 'put',
            data: query,
        })
    }
    exportPDF(payload) {
        return request({
            url: `/offerings/export-offering-grades/${payload.id}/${payload.lang}`,
            responseType: 'blob',
            method: 'get',
        })
    }
    statusUndo(id){
        return request({
            url: `/control/offerings/undo-control-status/${id}`,
            method: 'put',
        })
    }
    statusSubmit(id){
        return request({
            url: `/control/offerings/submit-control-status/${id}`,
            method: 'put',
        })
    }
    statusReview(id){
        return request({
            url: `/control/offerings/review-control-status/${id}`,
            method: 'put',
        })
    }
    statusApprove(id){
        return request({
            url: `/control/offerings/approve-control-status/${id}`,
            method: 'put',
        })
    }
    statusPublish(id){
        return request({
            url: `/control/offerings/publish-control-status/${id}`,
            method: 'put',
        })
    }
    statusFreez(id){
        return request({
            url: `/control/offerings/freez-control-status/${id}`,
            method: 'put',
        })
    }
    removeInstructor(resource)
    {
        return request({
            url: `/offerings/detach-instructors/${resource.offering_id}`,
            method: 'put',
            data: resource,
        })
    }
    SyncInstructors (payload)
    {
        return request({
            url: `/offerings/sync-instructors/${payload.id}`,
            method: 'put',
            data: payload,
        })
    }
    syncPrograms (payload)
    {
        return request({
            url: `/offerings/sync-programs/${payload.id}`,
            method: 'put',
            data: payload,
        })
    }
    removeProgram(resource)
    {
        return request({
            url: `/offerings/detach-program/${resource.offering_id}`,
            method: 'put',
            data: resource,
        })
    }

    //get groups in offering
    groupsLookup(offering_id) {
        return request({
            url: `/offerings/groupsLookup/${offering_id}`,
            method: 'get',
        })
    }
    
    //remove linked offering from offering
    removeLinkedOffering(resource)
    {
        return request({
            url: `/offerings/remove-linked-offering/${resource.offering_id}`,
            method: 'put',
            data: resource,
        })
    }
    addLinkedOffering(resource)
    {
        return request({
            url: `/offerings/add-linked-offerings/${resource.offering_id}`,
            method: 'put',
            data: resource,
        })
    }
    //barcode -> student in barcode page
    barcode(payload) {
        return request({
            url: `/control/offerings/barcode/students/${payload.offering_id}`,
            method: 'post',
            data: payload.query
        })
    }
    //get offering data in barcode page
    offeringBarcode(offering_id) {
        return request({
            url: `/control/offerings/barcode/${offering_id}`,
            method: 'get',
        })
    }
    //update grade by barcode
    updateBarcode(id, query) { //id offering id
        return request({
            url: `/control/students/barcode/update-final-mark/${id}`,
            method: 'put',
            data: query,
        })
    }
    // syncOfferingsToLms(resource)
    // {
    //     return request({
    //         url: `/offerings/sync-offerings-to-lms/${resource.offering_id}`,
    //         method: 'put',
    //         data: resource,
    //     })
    // }

}

export { Offering as default }