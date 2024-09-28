import TermStage from "@/api/administration/termStage/termStage";

const termStage = new TermStage();

const termStageModule={
    namespaced: true,
    state: {
    item: {
        stage_group_id:null,
        stage_code_id:null
    },
    items: [],
    total: 0,
    load: false,
    lookups: {},

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
    lookups(state) {
      return state.lookups;
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
    termStages({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true)
        termStage.list(payload.query)
          .then(response => {
            commit('SET_ITEMS', response.data)
            commit('SET_TOTAL_ITEMS', response.meta.count);
            commit('SET_LOOKUPS', response.meta.lookup)
            commit('SET_ITEMS_LOAD', false)
            resolve()
          })
      })
    },
    put({ commit }, payload) {
      commit('app/UPDATE_LOAD', true, { root: true })
      return new Promise((resolve, reject) => {
        termStage.put(payload.id, payload.query).then(response => {
          commit('app/UPDATE_LOAD', false, { root: true })
          resolve()
        }).catch(error => {
          commit('app/UPDATE_LOAD', false, { root: true })
          reject(error)
        })
      })
    },
    get({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true)
        termStage.get(id).then(response => {
          commit('SET_ITEM', response.data)
          if ( response && response.data && typeof response.data == 'object') {
            commit('app/UPDATE_PAGE_DETAILS', response.data, {root: true});
          }
          commit('SET_ITEMS_LOAD', false)
          resolve()
        })
      })
    },
    remove({ commit }, id) {
      return new Promise((resolve, reject) => {
        termStage.remove(id).then(response => {
          resolve()
        })
      })
    },
    restore({ commit }, id) {
      return new Promise((resolve, reject) => {
        termStage.restore(id).then(response => {
          resolve()
        })
      })
    },
  
  },

}

export default termStageModule;