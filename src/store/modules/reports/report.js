import Report from '../../../api/reports/reports';
import fileDownload from 'js-file-download'

const ReportRequest = new Report();

const reportModule = {
    namespaced: true,
    state:{
        load: false,
        financial:[],
        levelsfinancial:[],
        graduatesfinancial:[],
        reportLookups:{},
    },
    getters:{
        reportLookups(state){
            return state.reportLookups
        },
        load(state){
            return state.load
        }, 
        financial(state){
            return state.financial;
        },
        levelsfinancial(state){
            return state.levelsfinancial;
        },
        graduatesfinancial(state){
            return state.graduatesfinancial;
        },
    },
    mutations:{
        SET_LOAD(state , load){
            state.load = load
        },
        SET_FINANCIAL(state , financial){
            state.financial  = financial
        },
        SET_LEVELS_FINANCIAL(state , levelsfinancial){
            state.levelsfinancial  = levelsfinancial
        },
        SET_GRADUATES_FINANCIAL(state , graduatesfinancial){
            state.graduatesfinancial  = graduatesfinancial
        },
        SET_TYPES(state,data){
            state.reportLookups[data.link] = data.data
        }
    },
    actions:{
        ExportSysReports({commit},payload){
            return new Promise((resolve, reject) => {
                commit('SET_LOAD', true);
                ReportRequest.ExportSysReports(payload)
                .then((response)=>{
                    // fileDownload(response, payload.fileName || payload.title  + '.pdf')
                    commit('SET_LOAD', false);
                    resolve(response);
                }).catch((error)=>{
                    reject(error);
                    commit('SET_LOAD', false);
                });

            })
        },
        getReportsLookups({commit},payload){
            return new Promise((resolve, reject) => {
                commit('SET_LOAD', true);
                ReportRequest.getReportsLookups(payload)
                .then((response)=>{
                    commit('SET_TYPES',{link:payload.link,data:response.data});
                    commit('SET_LOAD', false);
                    resolve();
                }).catch((error)=>{
                    reject(error);
                    commit('SET_LOAD', false);
                });

            })
        },
        getFinancial({commit},payload){
            return new Promise((resolve, reject) => {
                commit('SET_LOAD', true);
                ReportRequest.financial(payload)
                .then((response)=>{
                    commit('SET_FINANCIAL',response.data);
                    commit('SET_LOAD', false);
                    resolve();
                }).catch((error)=>{
                    reject(error);
                    commit('SET_LOAD', false);
                });

            })
        },
        getLevelsFinancial({commit},payload){
            return new Promise((resolve, reject) => {
                commit('SET_LOAD', true);
                ReportRequest.levelsfinancial(payload)
                .then((response)=>{
                    commit('SET_LEVELS_FINANCIAL',response.data);
                    commit('SET_LOAD', false);
                    resolve();
                }).catch((error)=>{
                    reject(error);
                    commit('SET_LOAD', false);
                });

            })
        },
        getGraduatesFinancial({commit},payload){
            return new Promise((resolve, reject) => {
                commit('SET_LOAD', true);
                ReportRequest.graduatesfinancial(payload)
                .then((response)=>{
                    commit('SET_GRADUATES_FINANCIAL',response.data);
                    commit('SET_LOAD', false);
                    resolve();
                }).catch((error)=>{
                    reject(error);
                    commit('SET_LOAD', false);
                });

            })
        },
        downloadReport({commit},payload){
            return new Promise((resolve, reject) => {
                commit('SET_LOAD', true);
                ReportRequest.downloadReport(payload)
                .then((response)=>{
                    fileDownload(response, 'financial' + '.pdf')
                    commit('SET_LOAD', false);
                    resolve();
                }).catch((error)=>{
                    reject(error);
                    commit('SET_LOAD', false);
                });

            })
        },
        downloadLevelsReport({commit},payload){
            return new Promise((resolve, reject) => {
                commit('SET_LOAD', true);
                ReportRequest.downloadLevelsReport(payload)
                .then((response)=>{
                    fileDownload(response, 'financial' + '.pdf')
                    commit('SET_LOAD', false);
                    resolve();
                }).catch((error)=>{
                    reject(error);
                    commit('SET_LOAD', false);
                });

            })
        },
    },
}

export default reportModule;