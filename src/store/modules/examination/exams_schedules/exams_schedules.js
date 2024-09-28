import ExamsSchedules from '@/api/examination/exams_schedules/exams_schedules';
import fileDownload from 'js-file-download'

const schedules = new ExamsSchedules();

const examsSchedulesModule = {

    namespaced: true,
    state: {
        item: null,
        items: [],
        total: 0,
        lookups: null,
        exams: null,
        load: false,
        customLoad: false,
        locations: null
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
        customLoad(state) {
            return state.customLoad;
        },
        total(state) {
            return state.total;
        },
        status(state) {
            return state.item.removed;
        },
        lookups(state) {
            return state.lookups;
        },
        locations(state) {
            return state.locations;
        },
        exams(state) {
            return state.exams;
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
        SET_ITEMS_CUSTOM_LOAD: (state, customLoad) => {
            state.customLoad = customLoad;
        },
        SET_ITEM: (state, data) => {
            state.item = data;
        },
        SET_LOOKUPS(state, lookups) {
            state.lookups = lookups;
        },
        SET_LOCATIONS(state, locations) {
            state.locations = locations;
        },
        SET_EXAMS(state, exams) {
            state.exams = exams;
        },
    },
    actions: {
        examsSchedules({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_CUSTOM_LOAD', true);
                schedules.list(payload.id , payload.query)
                    .then(response => {
                        commit('SET_ITEMS', response.data);
                        commit('SET_TOTAL_ITEMS', response.meta.count);
                        commit('SET_LOOKUPS', response.meta.lookup);
                        resolve();
                        commit('SET_ITEMS_CUSTOM_LOAD', false);
                    })
            });
        },
        instructorExamsSchedules({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                schedules.listInstructorExamsSchedules(payload.id , payload.query)
                    .then(response => {
                        commit('SET_ITEMS', response.data);
                        commit('SET_TOTAL_ITEMS', response.meta.count);
                        commit('SET_LOOKUPS', response.meta.lookup);
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
            });
        },
        locationExamsSchedules({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                schedules.listLocationExamsSchedules(payload.id , payload.query)
                    .then(response => {
                        commit('SET_ITEMS', response.data);
                        commit('SET_TOTAL_ITEMS', response.meta.count);
                        commit('SET_LOOKUPS', response.meta.lookup);
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
            });
        },
        getStudentsRegistrations({ commit },  query) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                schedules.getStudentsRegistrations(query.exam_schedule_id, query.search_student_keyword)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
            });
        },
        examAbsence({ commit }, payload) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                schedules.examAbsence(payload.id, payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, { root: true });
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, { root: true });
                    reject(error);
                });
            });
        },
        examInvestigations({ commit }, payload) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                schedules.examInvestigations(payload.id, payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, { root: true });
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, { root: true });
                    reject(error);
                });
            });
        },
        lookups({ commit },  query) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                schedules.lookups(query.examId, query.query)
                    .then(response => {
                        commit('SET_LOOKUPS', response.data);
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
            });
        },
        GET_LOOKUPS({ commit },  query) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                schedules.lookups(query.id, query.query)
                    .then(response => {
                        // commit('SET_LOOKUPS', response.data);
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
            });
        },
        put({ commit }, payload) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                schedules.put(payload.id, payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, { root: true });
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, { root: true });
                    reject(error);
                });
            });
        },
        get({ commit }, id) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                schedules.get(id).then(response => {
                    commit('SET_ITEM', response.data);
                    if (response && response.data && typeof response.data == 'object') {
                        commit('app/UPDATE_PAGE_DETAILS', response.data.exam, { root: true });
                    }
                    if(response && response.meta){
                        commit('SET_EXAMS', response.meta.lookup);
                    }
                    commit('SET_ITEMS_LOAD', false);
                    resolve();
                })
            });
        },
        remove({ commit }, id) {
            return new Promise((resolve, reject) => {
                schedules.remove(id).then(response => {
                    resolve();
                })
            });
        },
        restore({ commit }, id) {
            return new Promise((resolve, reject) => {
                schedules.restore(id).then(response => {
                    resolve();
                })
            });
        },
        getAvailableLocations({ commit },  query) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                schedules.getAvailableLocations(query.examId, query.query)
                    .then(response => {
                        commit('SET_LOCATIONS', response.data);
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
            });
        },
        specifications({ commit }, payload) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                schedules.specifications(payload.id, payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, { root: true });
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, { root: true });
                    reject(error);
                });
            });
        },
        printPdf({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                schedules.printPdf(payload.query)
                .then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    fileDownload(response,'Exam Attendance Sheet.pdf');
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
    },
};

export default examsSchedulesModule;
