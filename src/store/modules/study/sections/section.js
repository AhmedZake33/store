import Section from '@/api/study/sections/section'

const section = new Section()

const sectionModule = {

  namespaced: true,
  state: {
    item: {
      id: null,
      term_id: null,
      program_id: null,
      level_id: null,
      group: null,
      section: null,
      quota: null,
      over_quota: null,
    },
    itemDetails:{},
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
    itemDetails(state) {
      return state.itemDetails
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
    SET_ITEM_DETAILS: (state, itemDetails) => {
      state.itemDetails = itemDetails
    },
    SET_ITEM: (state, data) => {
      state.item = data
      // state.item.id=data.id;
      // state.item.term_id=data.term.id;
      // state.item.program_id=data.program.id;
      // state.item.level_id=data.level.id;
      // state.item.section=data.section;
      // state.item.group=data.group;
      // state.item.quota=data.quota;
      // state.item.over_quota=data.over_quota;
    },
    SET_LOOKUPS(state, lookups) {
      state.lookups = lookups
    },
  },
  actions: {
    sections({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true)
        section.list(payload.query)
          .then(response => {
            commit('SET_ITEMS', response.data)
            commit('SET_TOTAL_ITEMS', response.meta.count)
            commit('SET_LOOKUPS', response.meta.lookup)
            commit('SET_ITEMS_LOAD', false)
            resolve()
          })
      })
    },
    put({ commit }, payload) {
      commit('app/UPDATE_LOAD', true, { root: true })
      return new Promise((resolve, reject) => {
        if(payload.id){
          section.put(payload.id, payload.query).then(response => {
            commit('app/UPDATE_LOAD', false, { root: true })
            resolve(response)
          }).catch(error => {
            commit('app/UPDATE_LOAD', false, { root: true })
            reject(error)
          })
        }
        else
        {
          section.add( payload.query).then(response => {
            commit('app/UPDATE_LOAD', false, { root: true })
            resolve(response)
          }).catch(error => {
            commit('app/UPDATE_LOAD', false, { root: true })
            reject(error)
          })
        }
        
      })
    },
    addSection({ commit }, payload) {
      commit('app/UPDATE_LOAD', true, { root: true })
      return new Promise((resolve, reject) => {
          section.addSection(payload).then(response => {
            commit('app/UPDATE_LOAD', false, { root: true })
            resolve(response)
          }).catch(error => {
            commit('app/UPDATE_LOAD', false, { root: true })
            reject(error)
          })   
      })
    },
    get({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true)
        section.get(id).then(response => {
          commit('SET_ITEM', response.data)
          commit('SET_ITEM_DETAILS', response.data)
          commit('app/UPDATE_PAGE_DETAILS', response.data.name, { root: true })
          commit('SET_ITEMS_LOAD', false)
          resolve(response.data)
        })
      })
    },
    remove({ commit }, id) {
      return new Promise((resolve, reject) => {
        section.remove(id).then(response => {
          resolve()
        })
        .catch(error => {
          
          reject(error)
        })   
      })
    },
    restore({ commit }, id) {
      return new Promise((resolve, reject) => {
        section.restore(id).then(response => {
          resolve()
        })
      })
    },
  },
}

export default sectionModule
