import Student from '@/api/control/students/student'

const student = new Student()

//const fileDownload = require('js-file-download')

const controlStudentModule = {
    namespaced: true,
    state: {
        item: {},
        items: [],
        total: 0,
        lookups: null,
        load: false,
        courses: null,
        loadCourse: null,
        termGrades: null,
        //statistics:{},
    },
    getters: {
        items(state) {
            return state.items
        },
        /*  statistics(state) {
             return state.statistics
         }, */
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
        termGrades(state) {
            return state.termGrades
        },
    },
    mutations: {
        SET_ITEMS: (state, data) => {
            state.items = data
        },
        /*  SET_STATISTICS: (state, statistics) => {
             state.statistics = statistics
         }, */
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
        SET_STUDENT_TERM_GRADES(state, termGrades) {
            state.termGrades = termGrades
        },
    },
    actions: {
        students({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true)
                student.list(payload.query).then(response => {
                    // commit('SET_STATISTICS', response.meta.details)
                    commit('SET_ITEMS', response.data)
                    commit('SET_TOTAL_ITEMS', response.meta.count)
                    commit('SET_LOOKUPS', response.meta.lookup)
                    commit('SET_ITEMS_LOAD', false)
                    resolve(response)
                }).catch(error => {
                    commit('SET_ITEMS_LOAD', false);
                    reject(error);
                });
            })
        },
        finishStudents({commit}, query) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true)
                student.finishStudents(query).then(response => {
                    commit('SET_ITEMS_LOAD', false)
                    resolve(response)
                })
            })
        },
        get({commit}, student_id) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true)
                student.get(student_id).then(response => {
                    /*
                    commit('app/UPDATE_PAGE_DETAILS', response.data.name, {
                    //     root: true,
                    // }) */
                    commit('SET_ITEMS_LOAD', false)
                    resolve(response)
                })

            })
        },
        /* show_control_student({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true)
                    student.show_control_student(payload).then(response => {
                        commit('SET_ITEM', response[0])

                        commit('SET_ITEMS_LOAD', false)
                        resolve(response)
                    })

            })
        }, */
        StudentTermGrades({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true)
                student.StudentTermGrades(payload.student_id, payload.term_id)
                    .then(response => {
                        commit('SET_STUDENT_TERM_GRADES', response.data)
                        commit('SET_ITEMS_LOAD', false)
                        resolve(response)
                    })
            })
        },
        UpdateStudentTermGrades({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true)
                student.UpdateStudentTermGrades(payload).then(response => {
                    //commit('SET_STUDENT_TERM_GRADES', response.data)

                    /* commit('app/UPDATE_PAGE_DETAILS', response.data.name, {
                        root: true,
                    }) */
                    commit('SET_ITEMS_LOAD', false)
                    resolve(response)
                })
                    .catch(error => {
                        reject(error)
                        commit('SET_ITEMS_LOAD', false)
                    })

            })
        },
        academicTakenCourses({commit}, id) {  //student id
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true)
                student.academicTakenCourses(id)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false)
                        resolve(response)
                    })


            })
        },
        passedSemesters({commit}, id) {  //student id
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true)
                student.passedSemesters(id)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false)
                        resolve(response)
                    })


            })
        },

    },

}

export default controlStudentModule
