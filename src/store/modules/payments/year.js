import Year from '@/api/payments/year'

const year = new Year()

const yearPaymentModule = {

  namespaced: true,
  state: {
    item: null,
    items: [],
    total: 0,
    lookups: null,
    load: false,
  },
  getters: {
    items(state) {
      return state.items
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
  },
  mutations: {
    SET_ITEMS: (state, users) => {
      state.items = users
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
  },
  actions: {
    put({ commit }, payload) {
      commit('app/UPDATE_LOAD', true, { root: true })
      commit('SET_ITEMS_LOAD', true)
      return new Promise((resolve, reject) => {
        year.put(payload.id, payload.query).then(response => {
          commit('app/UPDATE_LOAD', false, { root: true })
          commit('SET_ITEMS_LOAD', false)
          resolve(response)
        }).catch(error => {
          commit('app/UPDATE_LOAD', false, { root: true })
          commit('SET_ITEMS_LOAD', false)
          reject(error)
        })
      })
    },
    get({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true)
        year.get(id).then(response => {
          commit('SET_ITEM', response.data)
          commit('app/UPDATE_PAGE_DETAILS', response.data, { root: true })
          commit('SET_ITEMS_LOAD', false)
          resolve()
        })
      })
    },
    getTuitionFees({ commit }, payload) {
      return new Promise((resolve, reject) => {
        year.getPayments(payload.yearId, payload.type).then(response => {
          resolve(response)
        })
      })
    },
    getLevelPaymentSettings({ commit }, payload) {
      return new Promise((resolve, reject) => {
        year.getPayments(payload.yearId, `level-payment-settings/${payload.paymentSettingId}`).then(response => {
          resolve(response)
        })
      })
    },
    getSummerPaymentSettings({ commit }, payload) {
      return new Promise((resolve, reject) => {
        year.getPayments(payload.yearId, `summer-payment-settings/${payload.paymentSettingId}`).then(response => {
          resolve(response)
        })
      })
    },
    updateLevelPaymentSettings({ commit }, payload) {
      return new Promise((resolve, reject) => {
        year.updatePayments(payload.yearId, `level-payment-settings/${payload.paymentSettingId}`, payload.data).then(response => {
          resolve(response)
        })
      })
    },
    getPayments({ commit }, payload) {
      return new Promise((resolve, reject) => {
        year.getPayments(payload.yearId, payload.type).then(response => {
          resolve(response)
        })
      })
    },
    getPaymentSetting({ commit }, payload) {
      return new Promise((resolve, reject) => {
        year.getPaymentSetting(payload.yearId, payload.paymentSettingId,payload.data).then(response => {
          resolve(response)
        })
      })
    },
    updatePaymentSetting({ commit }, payload) {
      return new Promise((resolve, reject) => {
        year.updatePaymentSetting(payload.yearId, payload.paymentSettingId,payload.data,payload.params).then(response => {
          resolve(response)
        })
      })
    },
    removePaymentSetting({ commit }, payload) {
      return new Promise((resolve, reject) => {
        year.removePaymentSetting(payload.yearId, payload.paymentSettingId,payload.params).then(response => {
          resolve(response)
        })
      })
    },
    getPaymentAccounts({ commit }, payload) {
      return new Promise((resolve, reject) => {
        year.getPaymentAccounts(payload.yearId, payload.payload).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    updatePaymentAccount({ commit }, payload) {
      return new Promise((resolve, reject) => {
        year.updatePaymentAccount(payload.yearId, payload.accountId, payload.data).then(response => {
          resolve(response)
        }).catch(e => {
          reject(e)
        })
      })
    },
    removePaymentAccount({ commit }, payload) {
      return new Promise((resolve, reject) => {
        year.removePaymentAccount(payload.yearId, payload.accountId).then(response => {
          resolve(response)
        })
      })
    },

    getTuitionPaymentAccounts({ commit }, payload) {
      return new Promise((resolve, reject) => {
        year.getTuitionPaymentAccounts(payload.yearId,payload.type, payload.payload).then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    updateTuitionPaymentAccounts({ commit }, payload) {
      return new Promise((resolve, reject) => {
        year.updateTuitionPaymentAccounts(payload.yearId, payload.type, payload.data, payload.params).then(response => {
          resolve(response)
        })
      })
    },

    getLookups({ commit }, payload) {
      return new Promise((resolve,reject)=>{
        year.getTuitionPaymentAccounts(payload.yearId, payload.type).then(response=>{
          resolve(response);
        }).catch(e=>{
          reject(e)
        })
      });
    },

    editDueDate({ commit }, payload) {
      commit('app/UPDATE_LOAD', true, { root: true })
      commit('SET_ITEMS_LOAD', true)
      return new Promise((resolve, reject) => {
        year.editDueDate(payload.yearId, payload.type, payload.query).then(response => {
          commit('app/UPDATE_LOAD', false, { root: true })
          commit('SET_ITEMS_LOAD', false)
          resolve(response)
        }).catch(error => {
          commit('app/UPDATE_LOAD', false, { root: true })
          commit('SET_ITEMS_LOAD', false)
          reject(error)
        })
      })
    },

    getScholarship({ commit }, payload) {
      return new Promise((resolve, reject) => {
        year.getScholarship(payload.yearId, payload.scholarshipId, payload.query).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    getAutomaticScholarship({ commit }, payload) {
      return new Promise((resolve, reject) => {
        year.getAutomaticScholarship(payload.yearId, payload.scholarshipId, payload.query).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    updateScholarship({ commit }, payload) {
      return new Promise((resolve, reject) => {
        year.updateScholarship(payload.yearId, payload.scholarshipId , payload.data).then(response => {
          resolve(response)
        }).catch(e => {
          reject(e)
        })
      })
    },

    updateGradesRangeScolarship({ commit }, payload) {
      return new Promise((resolve, reject) => {
        year.updateGradesRangeScolarship(payload.yearId, payload.scholarshipId , payload.data).then(response => {
          resolve(response)
        }).catch(e => {
          reject(e)
        })
      })
    },

    addScholarship({ commit }, payload) {
      return new Promise((resolve, reject) => {
        year.addScholarship(payload.yearId, payload.data).then(response => {
          resolve(response)
        }).catch(e => {
          reject(e)
        })
      })
    },

    removeScholarship({ commit }, payload) {
      return new Promise((resolve, reject) => {
        year.removeScholarship(payload.yearId, payload.scholarshipId, payload.payment_setting_scholarship_id).then(response => {
          resolve(response)
        })
      })
    },

    getDueDates({ commit } , payload){
      return new Promise((resolve , reject) => {
        year.getDueDates(payload).then(response => {
          resolve(response);
        });
      })
    },
    
    saveDueDates({ commit } , payload){
      return new Promise((resolve , reject) => {
        year.saveDueDates(payload).then(response => {
          resolve(response);
        });
      })
    },

    getDueDates({ commit } , yearId){
      return new Promise((resolve , reject) => {
        year.getDueDates(yearId).then(response => {
          resolve(response);
        });
      })
    },

  },
}

export default yearPaymentModule
