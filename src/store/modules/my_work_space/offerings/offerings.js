import Offering from '@/api/my_work_space/offerings'

const offering = new Offering()

const fileDownload = require('js-file-download')

const myOfferingModule = {
    namespaced: true,
    state: {
        item: {},
        items: [],
        total: 0,
        totalBarcodes:0,
        lookups: null,
        load: false,
        courses: null,
        loadCourse: null,
        questions:null,
    },
    getters: {
        items(state) {
            return state.items
        },
        questions:state=>state.questions,
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
        totalBarcodes(state) {
            return state.totalBarcodes
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
        SET_QUESTIONS:(state,data)=>{
            state.questions = data
        },
        SET_TOTAL_ITEMS: (state, total) => {
            state.total = total
        },
        SET_TOTAL_BARCODES: (state, totalBarcodes) => {
            state.totalBarcodes = totalBarcodes
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
                offering.workspaceOfferings(payload.query).then(response => {
                    commit('SET_ITEMS', response.data)
                    commit('SET_TOTAL_ITEMS', response.meta.count)
                    commit('SET_LOOKUPS', response.meta.lookup)
                    commit('SET_ITEMS_LOAD', false)
                    resolve()
                })
            })
        },
       
    },
}

export default myOfferingModule