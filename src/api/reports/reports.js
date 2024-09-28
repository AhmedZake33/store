import Resource from '../resource'
import request from '../../utils/request'
const axios = require('axios');

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com/';

class Report extends Resource 
{
    constructor (){
        super('Report');
    }
   
    financial(payload){
        return request({
            url: 'reports/financial',
            method: 'post',
            data : payload
        })
    }
    // graduatedYears
    getReportsLookups(payload){
        return request({
            url: `reports/${payload.link}`,
            method: 'get',
            params:payload.query,
            ems_url:'ems'
        })
    }
    levelsfinancial(payload){
        return request({
            url: 'reports/levels-financial',
            method: 'post',
            data : payload
        })
    }
    graduatesfinancial(payload){
        return request({
            url: 'reports/graduates-financial',
            method: 'post',
            data : payload
        })
    }

    downloadReport(payload){
        return request({
            url: `reports/financial/download/${payload.lang}/${payload.type}`,
            responseType: 'blob',
            method: 'post',
            data : payload
        })
    }
    downloadLevelsReport(payload){
        return request({
            url: `reports/financial-levels/download/${payload.lang}/${payload.type}`,
            responseType: 'blob',
            method: 'post',
            data : payload
        })
    }
    ExportSysReports(payload){
        return request({
            url: `${payload.export?'':'reports'}/${payload.link}`,
            // responseType: 'blob',
            method: `${payload.export ? 'post':'get'}`,
            params:payload.query,
            ems_url:'ems'
        })
    }
    
    }

export {Report as default}