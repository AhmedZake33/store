import ExamsAbsences from '@/api/examination/exams_absences/exams_absences';

const examsAbsences = new ExamsAbsences();

const examsAbsencesModule = {

    namespaced: true,
    state: {
        item: null,
        items: [],
        total: 0,
        lookups: null,
        exams: null,
        student_info: null,
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
        student_info(state) {
            return state.student_info;
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
        SET_STUDENT_INFO(state, student_info) {
            state.student_info = student_info;
        },
    },
    actions: {
        examsAbsences({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_CUSTOM_LOAD', true);
                examsAbsences.list(payload.id , payload.query)
                    .then(response => {
                        commit('SET_ITEMS', response.data);
                        commit('SET_TOTAL_ITEMS', response.meta.count);
                        commit('SET_LOOKUPS', response.meta.lookup);
                        commit('SET_ITEMS_CUSTOM_LOAD', false);
                        resolve();
                    })
            });
        },
        lookups({ commit },  query) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                examsAbsences.lookups(query.examId, query.query)
                    .then(response => {
                        commit('SET_LOOKUPS', response.data);
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
            });
        },
        get_student_info({ commit }, payload) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                examsAbsences.get_student_info(payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, { root: true });
                    commit('SET_STUDENT_INFO', response.data)
                    resolve(response);
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, { root: true });
                    reject(error);
                });
            });
        },
        put({ commit }, payload) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                examsAbsences.put(payload).then(response => {
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
                examsAbsences.get(id).then(response => {
                    commit('SET_ITEM', response.data);
                    if (response && response.data && typeof response.data == 'object') {
                        commit('app/UPDATE_PAGE_DETAILS', response.data, { root: true });
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
                examsAbsences.remove(id).then(response => {
                    resolve();
                })
            });
        },
        restore({ commit }, id) {
            return new Promise((resolve, reject) => {
                examsAbsences.restore(id).then(response => {
                    resolve();
                })
            });
        },
    },
};

export default examsAbsencesModule;
