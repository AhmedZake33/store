import courseFile from '@/api/quality/courseFile/courseFile'

const offering = new courseFile()

const fileDownload = require('js-file-download')

const courseFileModule = {
    namespaced: true,
    state: {
        item: {},
        items: [],
        total: 0,
        totalBarcodes:0,
        count:[],
        countComment:0,
        comment:{},
        comments:[],
        lookups: null,
        load: false,
        commentLoad:false,
        courses: null,
        loadCourse: null,
        questions:null,
        statistics:{},
        archive:false,
    },
    getters: {
        items(state) {
            return state.items
        },
        archive(state) {
            return state.archive
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
        commentLoad(state){
            return state.commentLoad
        },
        count(state){
            return state.count
        },
        total(state) {
            return state.total
        },
        countComment(state) {
            return state.countComment
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
        statistics(state) {
            return state.statistics
        },
        comment(state) {
            return state.comment
        },
        comments(state) {
            return state.comments
        },
    },
    mutations: {
        SET_ITEMS: (state, users) => {
            state.items = users
        },
        SET_ITEM: (state, user) => {
            state.item = user
        },
        SET_ARCHIVE: (state, archive) => {
            state.archive = archive
        },
        // SET_QUESTIONS:(state,data)=>{
        //     state.questions = data
        // },
        SET_TOTAL_ITEMS: (state, total) => {
            state.total = total
        },
        // SET_TOTAL_BARCODES: (state, totalBarcodes) => {
        //     state.totalBarcodes = totalBarcodes
        // },
        SET_ITEMS_LOAD: (state, load) => {
            state.load = load
        },
        SET_ITEMS_LOAD: (state, load) => {
            state.load = load
        },
        SET_ITEMS_COMMENTSLOAD:(state,commentLoad)=>{
            state.commentLoad = commentLoad
        },
        // SET_ITEM: (state, user) => {
        //     state.item = user
        // },
        SET_COUNT(state, count) {
            state.count = count
        },
        SET_COUNTCOMMENT(state, countComment) {
            state.countComment = countComment
        },
        // SET_COURSES(state, data) {
        //     state.courses = data
        // },
        SET_STATISTICS: (state, statistics) => {
            state.statistics = statistics
        },
        SET_LOOKUPS(state, lookups) {
            state.lookups = lookups
        },
        SET_COMMENT(state, comment) {
            state.comment = comment
        },
        SET_COMMENTS(state, comments) {
            state.comments = comments
        },
    },actions: {
        courseFile({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true)
                offering.list(payload.query).then(response => {
                    commit('SET_ITEMS', response.data)
                    commit('SET_TOTAL_ITEMS', response.meta.count)
                    commit('SET_LOOKUPS', response.meta.lookup)
                    commit('SET_ITEMS_LOAD', false)
                    commit('SET_STATISTICS', response.meta.details)
                    // commit('COUNT_DRAFT',responce.meta.draft)
                    // commit('COUNT_ACC',responce.meta.Acc)
                    // commit('COUNT_NOT',responce.meta.notAcc)
                    // commit('COUNT_NOTAPR',responce.meta.notApr)
                    // commit('COUNT_APR',responce.meta.Apr)
                    resolve()
                })
            })
        },
        FileCount({ commit }, payload) {
            return new Promise((resolve, reject) => {
                //commit('SET_ITEMS_LOAD', true)
                offering.GetCount(payload.query).then(response => {
                    //commit('SET_ITEMS_LOAD', false)
                    commit('SET_COUNT',response[0])
                    resolve()
                })
            })
        },
        postComments({ commit }, payload) {
            return new Promise((resolve, reject) => {
                //commit('SET_ITEMS_LOAD', true)
                offering.postComment(payload).then(response => {
                    //commit('SET_ITEMS_LOAD', false)
                    commit('SET_COMMENTS',response.data)
                    resolve()
                })
            })
        },
        getComments({ commit }, payload) {
            commit('SET_ITEMS_COMMENTSLOAD', true)
            return new Promise((resolve, reject) => {
                //commit('SET_ITEMS_LOAD', true)
                offering.GetComment(payload).then(response => {
                    //commit('SET_ITEMS_LOAD', false)
                    commit('SET_COMMENTS',response.data)
                    commit('SET_ITEMS_COMMENTSLOAD', false)
                    //commit('SET_COMMENT',response.data)
                    resolve()
                })
            })
        },
        getAllComments({ commit }, payload) {

            return new Promise((resolve, reject) => {
                //commit('SET_ITEMS_LOAD', true)
                offering.GetAllComment(payload).then(response => {
                    //commit('SET_ITEMS_LOAD', false)
                    commit('SET_COMMENTS',response[0])
                    commit('SET_ITEMS_COMMENTSLOAD', false)
                    //commit('SET_COMMENT',response.data)
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
                                commit('app/UPDATE_PAGE_DETAILS', {...response.data.course,print_code:true}, {root: true});
                              }
                            commit('SET_ITEMS_LOAD', false)
                            resolve()
                        })
                } else {
                    offering.get(query).then(response => {
                        commit('SET_ITEM', response.data)
                        commit('app/UPDATE_PAGE_DETAILS', {...response.data.course,print_code:true}, {
                            root: true,
                        })
                        commit('SET_ITEMS_LOAD', false)
                        resolve(response)
                    })
                }
            })
        },
        changeStatus({ commit }, id) {
            return new Promise((resolve, reject) => {
                //commit('SET_ITEMS_LOAD', true)
                offering.changeStatu(id).then(response => {
                    //commit('SET_ITEMS_LOAD', false)
                    commit('SET_ITEMS',response.data)
                    resolve()
                })
            })
        },
        updateStatus({ commit }, id) {
            return new Promise((resolve, reject) => {
                //commit('SET_ITEMS_LOAD', true)
                offering.updateStatu(id).then(response => {
                    //commit('SET_ITEMS_LOAD', false)
                    commit('SET_ITEMS',response.data)
                    // commit('')
                    resolve()
                })
            })
        },
        accStatus({ commit }, id) {
            return new Promise((resolve, reject) => {
                //commit('SET_ITEMS_LOAD', true)
                offering.accStatu(id).then(response => {
                    //commit('SET_ITEMS_LOAD', false)
                    commit('SET_ITEMS',response.data)
                    resolve()
                })
            })
        },
        notAccStatus({ commit }, id) {
            return new Promise((resolve, reject) => {
                //commit('SET_ITEMS_LOAD', true)
                offering.notAccStatu(id).then(response => {
                    //commit('SET_ITEMS_LOAD', false)
                    commit('SET_ITEMS',response.data)
                    resolve()
                })
            })
        },
        approvedStatus({ commit }, id) {
            return new Promise((resolve, reject) => {
                //commit('SET_ITEMS_LOAD', true)
                offering.approve(id).then(response => {
                    //commit('SET_ITEMS_LOAD', false)
                    commit('SET_ITEMS',response.data)
                    resolve()
                })
            })
        },
        notAppStatus({ commit }, id) {
            return new Promise((resolve, reject) => {
                //commit('SET_ITEMS_LOAD', true)
                offering.notApprove(id).then(response => {
                    //commit('SET_ITEMS_LOAD', false)
                    commit('SET_ITEMS',response.data)
                    resolve()
                })
            })
        },
        checkArchives({ commit }, id) {
            return new Promise((resolve, reject) => {
                //commit('SET_ITEMS_LOAD', true)
                offering.checkArchive(id).then(response => {
                    //commit('SET_ITEMS_LOAD', false)
                    commit('SET_ARCHIVE',response[0])
                    resolve()
                })
            })
        },
        undoStatus({ commit }, payload) {
            return new Promise((resolve, reject) => {
                //commit('SET_ITEMS_LOAD', true)
                offering.undo(payload).then(response => {
                    //commit('SET_ITEMS_LOAD', false)
                    
                    resolve()
                })
            })
        },
        exportData({ commit }, query) {
            return new Promise((resolve, reject) => {
                offering
                    .exportData(query.lang, query.query)
                    .then(response => {
                        fileDownload(response, 'Coursefiles.xlsx')
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },

    }
}
export default courseFileModule
