import gradesRecheck from '@/api/control/grades_recheck/grades_recheck'

const grades_recheck = new gradesRecheck()

//const fileDownload = require('js-file-download')

const gradesRecheckModule = {
    namespaced: true,
    state: {
        item: {},
        items: [],
        total: 0,
        lookups: null,
        load: false,
        courses: null,
        loadCourse: null,
        statistics:{},
    },
    getters: {
        items(state) {
            return state.items
        },
        statistics(state) {
            return state.statistics
        },
        courses(state) {
            return state.courses
        },
        item(state) {
            return state.item
        },
        load(state) {
            return state.load
        },
        total(state) {
            return state.total
        },
        status(state) {
            return state.item.removed
        },
        lookups(state) {
            return state.lookups
        },
        loadCourses(state) {
            return state.loadCourse
        },
    },
    mutations: {
        SET_ITEMS: (state, users) => {
            state.items = users
        },
        SET_STATISTICS: (state, statistics) => {
            state.statistics = statistics
        },
        SET_TOTAL_ITEMS: (state, total) => {
            state.total = total
        },
        SET_ITEMS_LOAD: (state, load) => {
            state.load = load
        },
        SET_ITEM: (state, user) => {
            state.item = user
        },
        SET_LOOKUPS(state, lookups) {
            state.lookups = lookups
        },
        SET_COURSES(state, data) {
            state.courses = data
        },
        SET_COURSES_LOAD(state, data) {
            state.loadCourse = data
        },
    },
    actions: {
        gradesRecheck({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                grades_recheck.list(payload.query)
                    .then(response => {
                        commit('SET_ITEMS', response.data);
                        commit('SET_TOTAL_ITEMS', response.meta.count);
                        commit('SET_DETAILS', response.meta.details);
                        commit('SET_LOOKUPS', response.meta.lookup);
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
            });
        },
        put({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                grades_recheck.put(payload.id, payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        updateStatus({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                grades_recheck.updateStatus(payload.id, payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        get({commit}, id) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                grades_recheck.get(id).then(response => {
                    commit('SET_ITEM', response.data);
                    commit('SET_ITEMS_LOAD', false);
                    resolve();
                })
            });
        },
        remove({commit}, id) {
            return new Promise((resolve, reject) => {
                grades_recheck.remove(id).then(response => {
                    resolve();
                })
            });
        },
    },
}

export default gradesRecheckModule