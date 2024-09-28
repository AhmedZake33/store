import CourseOffering from '@/api/control/course_offerings/course_offering'

const offering = new CourseOffering()

//const fileDownload = require('js-file-download')

const courseOfferingModule = {
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
        offerings({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true)
                offering.list(payload.query).then(response => {
                    commit('SET_ITEMS', response.data)
                    commit('SET_STATISTICS', response.meta.details)
                    commit('SET_TOTAL_ITEMS', response.meta.count)
                    commit('SET_LOOKUPS', response.meta.lookup)
                    commit('SET_ITEMS_LOAD', false)
                    resolve()
                })
            })
        },
        get({ commit }, query) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true)
                if (typeof query === 'object') {
                    offering
                        .get(query.id, {
                            get_edit: query.get_edit,
                        })
                        .then(response => {
                            commit('SET_ITEM', response.data)
                            if ( response && response.data && typeof response.data == 'object') {
                                commit('app/UPDATE_PAGE_DETAILS', response.data, {root: true});
                              }
                            commit('SET_ITEMS_LOAD', false)
                            resolve()
                        })
                } else {
                    offering.get(query).then(response => {
                        commit('SET_ITEM', response.data)
                        commit('app/UPDATE_PAGE_DETAILS', response.data.name, {
                            root: true,
                        })
                        commit('SET_ITEMS_LOAD', false)
                        resolve(response)
                    })
                }
            })
        },
        exportPDF({ commit }, query) {
            return new Promise((resolve, reject) => {
                offering
                    .exportPDF(query)
                    .then(response => {
                        fileDownload(response, 'offeringStudentGrades.pdf')
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },
      
    },
}

export default courseOfferingModule