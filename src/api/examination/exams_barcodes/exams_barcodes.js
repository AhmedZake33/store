import Resource from '../../resource';
import request from '../../../utils/request';

class ExamsBarcodes extends Resource {
    constructor() {
        super('exam-barcodes');
    }

    lookups() {
        return request({
            url: `/exam-barcodes/lookups`,
            method: 'get'
        });
    }

    generateBackupBarcodes(query) {
        return request({
            url: `/exam-barcodes/generate_backup_barcodes`,
            method: 'put',
            data: query,
        })
    }

    searchForStudent(query) {
        return request({
            url: `/exam-barcodes/search_for_student`,
            method: 'post',
            data: query,
        })
    }

    attachBackupBarcodeToStudent(query) {
        return request({
            url: `/exam-barcodes/attach_backup_barcode`,
            method: 'post',
            data: query,
        })
    }

    detachBackupBarcodeToStudent(barcode) {
        return request({
            url: `/exam-barcodes/detach_backup_barcode` + '/' + barcode,
            method: 'post',
        })
    }

    exportBarcodes(payload){
        return request({
            url: `/exam-barcodes/export-exam-barcode`,
            method: 'post',
            responseType: "blob",
            data: payload
        });
    }

    exportBackupBarcodes(){
        return request({
            url: `/exam-barcodes/export-backup-barcodes`,
            method: 'post',
            responseType: "blob",
        });
    }

}

export { ExamsBarcodes as default };
