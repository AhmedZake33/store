import TicketGroups from '../../../../api/administration/ticket_groups/ticket_groups'

const ticket_groups = new TicketGroups()

const TicketGroupsModule = {
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
    SET_ITEMS: (state, items) => {
      state.items = items
    },
    SET_TOTAL_ITEMS: (state, total) => {
      state.total = total
    },
    SET_ITEMS_LOAD: (state, load) => {
      state.load = load
    },
    SET_ITEM: (state, item) => {
      state.item = item
    },
    SET_LOOKUPS(state, lookups) {
      state.lookups = lookups
    },
  },
  actions: {
    list({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true)
        ticket_groups.list(payload.query).then(response => {
          commit('SET_ITEMS', response.data)
          commit('SET_TOTAL_ITEMS', response.meta.count)
          commit('SET_ITEMS_LOAD', false)
          commit('SET_LOOKUPS', response.meta.lookup)
          resolve()
        })
      })
    },
    update({ commit }, payload) {
      commit('app/UPDATE_LOAD', true, { root: true })
      return new Promise((resolve, reject) => {
        ticket_groups.put(payload.id, payload.query)
          .then(response => {
            commit('app/UPDATE_LOAD', false, { root: true })
            resolve(response)
          }).catch(error => {
            commit('app/UPDATE_LOAD', false, { root: true })
            reject(error)
          })
      })
    },
    create({ commit }, payload) {
      commit('app/UPDATE_LOAD', true, { root: true })
      return new Promise((resolve, reject) => {
        ticket_groups.post(payload.query)
          .then(response => {
            commit('app/UPDATE_LOAD', false, { root: true })
            resolve(response)
          }).catch(error => {
            commit('app/UPDATE_LOAD', false, { root: true })
            reject(error)
          })
      })
    },
    get({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true)
        ticket_groups.get(payload)
          .then(response => {
            commit('SET_ITEM', response.data)
            commit('SET_LOOKUPS', response.meta)
            if (response && response.data && typeof response.data === 'object') {
              commit('app/UPDATE_PAGE_DETAILS', response.data, { root: true })
            }
            commit('SET_ITEMS_LOAD', false)
            resolve()
          }).catch(error => {
            reject(error)
          })
      })
    },
    edits({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true)
        ticket_groups.edit(payload).then(response => {
          resolve(response)
          commit('SET_ITEMS_LOAD', false)
        }).catch(error => {
          reject(error)
        })
      })
    },
    remove({ commit }, id) {
      return new Promise((resolve, reject) => {
        ticket_groups.remove(id).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error.response.data)
        })
      })
    },
    getMembers({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true)
        ticket_groups.get(payload).then(response => {
          resolve(response)
          commit('SET_ITEMS_LOAD', false)
        }).catch(error => {
          reject(error)
        })
      })
    },
    addMembers({ commit }, payload) {
      return new Promise((resolve, reject) => {
        ticket_groups.put(payload.id, payload.query).then(response => {
          resolve(response)
        })
      })
    },
    removeMember({ commit }, payload) {
      return new Promise((resolve, reject) => {
        ticket_groups.put(payload.id, payload.query).then(response => {
          resolve(response)
        })
      })
    },
  },
}

export default TicketGroupsModule
