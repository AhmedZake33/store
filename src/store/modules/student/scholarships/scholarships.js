import Scholarship from '../../../../api/student/scholarships/scholarships';
import fileDownload from 'js-file-download'

const scholarship = new Scholarship();

const scholarshipsModule = {
    namespaced: true,
    state: {
        item: {},
        items: [],
        studentScholarships: [],
        total: 0,
        lookups: null,
        load: false,
    },
    getters: {
        items(state) {
            return state.items;
        },
        studentScholarships(state) {
            return state.studentScholarships;
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
        }
    },
    mutations: {
        SET_ITEMS: (state, users) => {
            state.items = users;
        },
        SET_STUDENT_SCHOLARSHIPS: (state, scholarships) => {
            state.studentScholarships = scholarships;
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
        }
    },
    actions: {
        scholarships({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                scholarship.list(payload.query).then(response => {
                    commit('SET_ITEMS', response.data);
                    commit('SET_TOTAL_ITEMS', response.meta.count);
                    commit('SET_ITEMS_LOAD', false);
                    commit('SET_LOOKUPS', response.meta.lookup);
                    commit('SET_OPTIONS', response.meta.lookup);
                    resolve();
                });
            });
        },
        getStudentScholarships({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                scholarship.scholarships(payload.student_id, payload.query).then(response => {
                    commit('SET_STUDENT_SCHOLARSHIPS', response);
                    resolve(response);
                    commit('SET_ITEMS_LOAD', false);
                });
            });
        },
        put({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                scholarship
                    .put(payload.id, payload.query, payload.details)
                    .then(response => {
                        commit('app/UPDATE_LOAD', false, {root: true});
                        resolve(response);
                    })
                    .catch(error => {
                        commit('app/UPDATE_LOAD', false, {root: true});
                        reject(error);
                    });
            });
        },
        get({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                scholarship
                    .get(payload)
                    .then(response => {
                        commit('SET_ITEM', response.data);
                        if (response.data.scholarship.data == null) {
                            response.data.scholarship.data = {}
                        }
                        commit('SET_scholarship', response.data.scholarship);
                        // commit("SET_LOOKUPS", response.meta);
                        commit('app/UPDATE_PAGE_DETAILS', response.data.scholarship, {root: true});
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        remove({commit}, id) {
            return new Promise((resolve, reject) => {
                scholarship.remove(id).then(response => {
                    resolve();
                });
            });
        },
        restore({commit}, id) {
            return new Promise((resolve, reject) => {
                scholarship.restore(id).then(response => {
                    resolve();
                });
            });
        },
        lookup({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                scholarship
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
        exportDataExcel({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                scholarship.exportDataExcel(payload.query)
                    .then(response => {
                        fileDownload(response, 'scholarships.xlsx');
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        }
    },
};

export default scholarshipsModule;
