import Offering from '@/api/study/offerings/offering'

const offering = new Offering()

const fileDownload = require('js-file-download')

const offeringModule = {
  namespaced: true,
  state: {
    item: {},
    items: [],
    total: 0,
    totalBarcodes: 0,
    lookups: null,
    load: false,
    courses: null,
    loadCourse: null,
    questions: null,
  },
  getters: {
    items(state) {
      return state.items
    },
    questions: state => state.questions,
    courses(state) {
      return state.courses
    },
    statistics(state) {
      return state.statistics
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
    SET_STATISTICS: (state, data) => {
      state.statistics = data
    },
    SET_QUESTIONS: (state, data) => {
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
        commit('app/SET_GENERAL_LOAD', {
          link: 'offerings',
          data: true
        }, { root: true })
        offering.list(payload.query)
          .then(response => {
            commit('SET_ITEMS', response.data)
            commit('SET_TOTAL_ITEMS', response.meta.count)
            commit('app/SET_GENERAL_TOTAL', {
              link: 'offerings',
              data: response.meta.count
            }, { root: true })
            commit('app/SET_GENERAL_LOAD', {
              link: 'offerings',
              data: false
            }, { root: true })
            resolve()
          })
      })
    },
    autoFill({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true)
        offering.autoFill(payload)
          .then(response => {
            commit('SET_ITEMS_LOAD', false)
            resolve()
          })
      })
    },
    statistics({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offering.statistics(payload)
          .then(response => {
            commit('SET_STATISTICS', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })

    },
    putAnswer({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true)
        offering.putAnswer(payload.query)
          .then(response => {
            commit('SET_ITEMS_LOAD', false)
            resolve(response)
          })
      })
    },
    questions({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true)
        offering.questions(payload.query)
          .then(response => {
            commit('SET_QUESTIONS', response.data)
            commit('SET_ITEMS_LOAD', false)
            resolve(response)
          })
      })
    },
    put({ commit }, payload) {
      commit('app/UPDATE_LOAD', true, {
        root: true,
      })
      return new Promise((resolve, reject) => {
        offering
          .put(payload.id, payload.query)
          .then(response => {
            commit('app/UPDATE_LOAD', false, {
              root: true,
            })
            resolve(response)
          })
          .catch(error => {
            commit('app/UPDATE_LOAD', false, {
              root: true,
            })
            reject(error)
          })
      })
    },
    add({ commit }, payload) {
      commit('app/UPDATE_LOAD', true, {
        root: true,
      })
      return new Promise((resolve, reject) => {
        offering
          .add(payload.query)
          .then(response => {
            commit('app/UPDATE_LOAD', false, {
              root: true,
            })
            resolve(response)
          })
          .catch(error => {
            commit('app/UPDATE_LOAD', false, {
              root: true,
            })
            reject(error)
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
              if (response && response.data && typeof response.data == 'object') {
                commit('app/UPDATE_PAGE_DETAILS', {
                  ...response.data.course,
                  print_code: true
                }, { root: true })
              }
              commit('SET_ITEMS_LOAD', false)
              resolve()
            })
        } else {
          offering.get(query)
            .then(response => {
              commit('SET_ITEM', response.data)
              commit('app/UPDATE_PAGE_DETAILS', {
                ...response.data.course,
                print_code: true
              }, {
                root: true,
              })
              commit('SET_ITEMS_LOAD', false)
              resolve(response)
            })
        }
      })
    },
    remove({ commit }, id) {
      return new Promise((resolve, reject) => {
        offering.remove(id)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    restore({ commit }, id) {
      return new Promise((resolve, reject) => {
        offering.restore(id)
          .then(response => {
            resolve()
          })
      })
    },
    exportData({ commit }, query) {
      commit('SET_ITEMS_LOAD', true)
      return new Promise((resolve, reject) => {
        offering
          .exportData(query.lang, query.query)
          .then(response => {
            fileDownload(response, 'offerings.xlsx')
            commit('SET_ITEMS_LOAD', false)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    exportStudentGrades({ commit }, query) {
      const timeElapsed = Date.now()
      const today = new Date(timeElapsed)
      return new Promise((resolve, reject) => {
        offering
          .exportStudentGrades(query.id, query.lang)
          .then(response => {
            fileDownload(response, query.query.course.code + '_' + query.query.term.name + '_' + query.query.id + '_Grades_' + today.toLocaleDateString()
              .toString()
              .replace('/', '_') + '.xlsx')
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
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
    upload({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('app/UPDATE_LOAD', true, { root: true })
        offering.upload(payload.resource, payload.id, payload.lang)
          .then(response => {
            commit('app/UPDATE_LOAD', false, { root: true })
            resolve(response)
          })
          .catch(error => {
            resolve(error)
          })
      })
    },
    submitImportedExcel({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('app/UPDATE_LOAD', true, { root: true })
        offering.submitImportedExcel(payload)
          .then(response => {
            commit('app/UPDATE_LOAD', false, { root: true })
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    syncOfferingsToLms({ commit }, id) {
      return new Promise((resolve, reject) => {
        offering
          .syncOfferingsToLms(id)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    updateStudentGradeFromExcel({
      commit,
      state
    }, resource) {
      commit('app/UPDATE_LOAD', true, { root: true })
      return new Promise((resolve, reject) => {
        offering
          .updateStudentGradeFromExcel(resource)
          .then(response => {
            commit('app/UPDATE_LOAD', false, { root: true })
            resolve(response)
          })
          .catch(error => {
            commit('app/UPDATE_LOAD', false, { root: true })
            reject(error)
          })
      })
    },
    program_courses({ commit }, payload) {
      commit('SET_COURSES_LOAD', true)
      return new Promise((resolve, reject) => {
        offering
          .program_courses(payload)
          .then(response => {
            commit('SET_COURSES', response.success.offering_courses)
            commit('SET_COURSES_LOAD', false)
            resolve(response)
          })
          .catch(error => {
            commit('SET_COURSES_LOAD', false)
            reject(error)
          })
      })
    },
    offering_mark({ commit }, id) {
      return new Promise((resolve, reject) => {
        offering
          .offering_mark(id)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    addMultiSections({ commit }, payload) {
      commit('app/UPDATE_LOAD', true, {
        root: true,
      })
      return new Promise((resolve, reject) => {
        offering
          .addMultiSections(payload.id, payload.query)
          .then(response => {
            commit('app/UPDATE_LOAD', false, {
              root: true,
            })
            resolve(response)
          })
          .catch(error => {
            commit('app/UPDATE_LOAD', false, {
              root: true,
            })
            reject(error)
          })
      })
    },
    statusUndo({ commit }, id) {
      return new Promise((resolve, reject) => {
        offering
          .statusUndo(id)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    statusSubmit({ commit }, id) {
      return new Promise((resolve, reject) => {
        offering
          .statusSubmit(id)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    statusReview({ commit }, id) {
      return new Promise((resolve, reject) => {
        offering
          .statusReview(id)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    statusApprove({ commit }, id) {
      return new Promise((resolve, reject) => {
        offering
          .statusApprove(id)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    statusFinish({ commit }, id) {
      return new Promise((resolve, reject) => {
        offering
          .statusFinish(id)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    statusPublish({ commit }, id) {
      return new Promise((resolve, reject) => {
        offering
          .statusPublish(id)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    statusFreez({ commit }, id) {
      return new Promise((resolve, reject) => {
        offering
          .statusFreez(id)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    removeInstructor({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offering.removeInstructor(payload)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })

    },
    removeProgram({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offering.removeProgram(payload)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })

    },
    SyncInstructors({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offering.SyncInstructors(payload)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })

    },
    syncPrograms({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offering.syncPrograms(payload)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })

    },

    //get groups in offering
    groupsLookup({ commit }, id) {
      return new Promise((resolve, reject) => {
        offering.groupsLookup(id)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })

    },

    removeLinkedOffering({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offering.removeLinkedOffering(payload)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })

    },
    addLinkedOffering({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offering.addLinkedOffering(payload)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    /*syncOfferingsToLms({ commit }, payload) {
        return new Promise((resolve, reject) => {
            offering.syncOfferingsToLms(payload).then(response => {
                resolve(response)
            })
                .catch(error => {
                    reject(error)
                })
        })
    },*/

    barcode({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offering.barcode(payload)
          .then(response => {
            commit('SET_TOTAL_BARCODES', response.meta.count)
            /*  if ( response  && typeof response == 'object') {
                 commit('app/UPDATE_PAGE_DETAILS', {...response.course,print_code:true}, {root: true});
               } */
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })

    },
    offeringBarcode({ commit }, id) {
      return new Promise((resolve, reject) => {
        offering.offeringBarcode(id)
          .then(response => {
            if (response && typeof response == 'object') {
              commit('app/UPDATE_PAGE_DETAILS', {
                ...response.course,
                print_code: true
              }, { root: true })
            }
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })

    },
    updateBarcode({ commit }, payload) {
      commit('app/UPDATE_LOAD', true, {
        root: true,
      })
      return new Promise((resolve, reject) => {
        offering
          .updateBarcode(payload.id, payload.query)
          .then(response => {
            commit('app/UPDATE_LOAD', false, {
              root: true,
            })
            resolve(response)
          })
          .catch(error => {
            commit('app/UPDATE_LOAD', false, {
              root: true,
            })
            reject(error)
          })
      })
    },

    exportMigrationTemplate({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true)
        offering
          .exportMigrationTemplate()
          .then(response => {
            fileDownload(response, 'Offerings and Registrations Migration Template.xlsx')
            commit('SET_ITEMS_LOAD', false)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    updateStatusBulk({ commit }, payload) {
      console.log(payload);
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true)
        offering
          .updateStatusBulk(payload)
          .then(response => {
            commit('SET_ITEMS_LOAD', false)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
  },
}

export default offeringModule
