import academicAdvisors from '@/api/study/academic_advisors/academic_advisors';
import fileDownload from 'js-file-download'

const advisors = new academicAdvisors();

const academicAdvisorsModule = {

    namespaced: true,
    state: {
        item: null,
        items: [],
        total: null,
        lookups: null,
        load: false,
        avalibleAdvisors:[],
        totalOfAdvisors: null,
        advisorslookups: null,
    },
    getters: {
        items(state) {
            return state.items;
        },
        item(state) {
            return state.item;
        },
        load(state) {
            return state.load;
        },
        total(state) {
            return state.total;
        },
        
        lookups(state) {
            return state.lookups;
        },
        avalibleAdvisors(state){
            return state.avalibleAdvisors;
        },
        totalOfAdvisors(state){
            return state.totalOfAdvisors;
        },
        advisorslookups(state){
            return state.advisorslookups;
        }

    },
    mutations: {
        SET_ITEMS: (state, users) => {
            state.items = users;
        },
        SET_TOTAL_ITEMS: (state, total) => {
            state.total = total;
        },
        SET_ITEMS_LOAD: (state, load) => {
            state.load = load;
        },
        SET_ITEM: (state, user) => {
            state.item = user;
        },
        SET_LOOKUPS(state, lookups) {
            state.lookups = lookups;
        },
        SET_AVALIBLE_ADVISORS(state,avalibleAdvisors){
            state.avalibleAdvisors=avalibleAdvisors;
        },
        SET_TOTAL_OF_ADVISORS(state,totalOfAdvisors){
            state.totalOfAdvisors=totalOfAdvisors;
        },
        SET_ADVISORS_LOOKUPS(state,advisorslookups){
            state.advisorslookups=advisorslookups;
        }
    },
    actions: {
        export({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                advisors
                    .export(payload)
                    .then(response => {
                        fileDownload(response, payload.excel_name ? `${payload.excel_name}.xlsx` : 'advisors.xlsx');
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        advisorslist({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                advisors.listAdvisors(payload.query)
                    .then(response => {
                        commit('SET_ITEMS', response.data);
                        commit('SET_TOTAL_ITEMS', response.meta.count);
                        commit('SET_LOOKUPS', response.meta.lookup);
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
            });
        },
        advisedStudents({commit}, payload) {
            return new Promise((resolve, reject) => {
                advisors.advisedStudents(payload)
                    .then(response => {
                        resolve(response);
                    })
            });
        },
        avalibleAdvisorsList({commit}, payload){
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                advisors.avalibleAdvisorsList(payload.query)
                    .then(response => {
                        commit('SET_AVALIBLE_ADVISORS', response.data);
                        commit('SET_TOTAL_OF_ADVISORS', response.meta.count);
                        commit('SET_ADVISORS_LOOKUPS', response.meta.lookup);
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
            });
        },
        deleteAdvisor({commit},advisor_id){
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                advisors.deleteAdvisor(advisor_id)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
            });
        }
       
       
        
       
    },
};

export default academicAdvisorsModule;
