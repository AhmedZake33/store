import EquivalentReport from '../../../../api/student/reports/equivalent.js';
import fileDownload from 'js-file-download'

const equivalentReport = new EquivalentReport();

const equivalentReportModule = {
    namespaced: true,
    state: {
        item: {},
        dashboard: {},
        items: [],
        total: 0,
        lookups: null,
        options:null,
        load: false,
        courses: [],
        equivalent: null,
        isEditMode:false,
        editModePage:null,
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
        equivalent(state) {
            return state.equivalent
        },
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
        SET_ITEM: (state, item) => {
            state.item = item
        },
        SET_LOOKUPS(state, lookups) {
            state.lookups = lookups;
        },
        SET_equivalent(state, equivalent) {
            state.equivalent = equivalent
        },
    },
    actions: {
        equivalents({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                equivalentReport.list(payload.type , payload.query).then(response => {
                    commit('SET_ITEMS', response.data);
                    commit('SET_TOTAL_ITEMS', response.meta.count);
                    commit('SET_LOOKUPS', response.meta.lookup);
                    commit('SET_ITEMS_LOAD', false);
                    resolve();
                });
            });
        },
        restore({commit}, id) {
            return new Promise((resolve, reject) => {
                equivalentReport.restore(id).then(response => {
                    resolve();
                });
            });
        },
        lookup({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                equivalentReport
                    .lookup(payload)
                    .then(response => {
                        commit("SET_LOOKUPS", response.success);
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        export({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                equivalentReport.export(payload.type , payload.query)
                    .then(response => {
                        fileDownload(response, 'equivalents.xlsx');
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        print({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                equivalentReport.print(payload.type , payload.query)
                    .then(response => {
                        fileDownload(response, 'equivalents.pdf');
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        search({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                equivalentReport.search(payload.query).then(response => {
                    commit('SET_ITEMS', response.data);
                    commit('SET_ITEMS_LOAD', false);
                    resolve(response);
                });
            });
        },
    },


};

export default equivalentReportModule;
