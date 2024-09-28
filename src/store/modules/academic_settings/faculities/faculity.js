import Faculty from '../../../../api/academic_settings/faculities/faculty'
import fileDownload from 'js-file-download'
import router from "@/router";

const faculty = new Faculty()

const facultyModule = {

  namespaced: true,
  state: {
    item: null,
    items: [],
    total: 0,
    load: false,
    addLoad: false,
    newFaculty: null,
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
    addLoad(state) {
      return state.addLoad
    },
    newFaculty(state) {
      return state.newFaculty
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
    SET_ITEM: (state, user) => {
      state.item = user
    },
    SET_LOOKUPS(state, lookups) {
      state.lookups = lookups
    },
    SET_ADD_LOAD(state, load) {
      state.addLoad = load
    },
    SET_NEW(state, user) {
      state.newFaculty = user
    },
  },
  actions: {
    faculties({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('app/SET_GENERAL_LOAD', {link:'faculties',data:true},{root:true});
        faculty.list(payload.query)
          .then(response => {
            commit('SET_ITEMS', response.data)
            commit('SET_TOTAL_ITEMS', response.meta.count);
            commit('app/SET_GENERAL_TOTAL', {link:'faculties',data:response.meta.count},{root:true});
            commit('app/SET_GENERAL_LOAD', {link:'faculties',data:false},{root:true});
            resolve(response)
          }).catch(error => {
            commit('app/SET_GENERAL_LOAD', {link:'faculties',data:false},{root:true});
            reject(error);
        });
      })
    },
    put({ commit }, payload) {
      commit('app/UPDATE_LOAD', true, { root: true })
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true)
        faculty.put(payload.id, payload.query).then(response => {
          commit('app/UPDATE_LOAD', false, { root: true })
          // router.push({ name: 'faculty', params: { id: response.data.id } })
          commit('SET_ITEMS_LOAD', false)
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
        faculty.get(id).then(response => {
          commit('SET_ITEM', response.data)
          if ( response && response.data && typeof response.data == 'object') {
            commit('app/UPDATE_PAGE_DETAILS', response.data, {root: true});
          }
          commit('SET_ITEMS_LOAD', false)
          resolve(response)
        })
      })
    },
    remove({ commit }, id) {
      return new Promise((resolve, reject) => {
        faculty.remove(id).then(response => {
          resolve()
        })
      })
    },
    restore({ commit }, id) {
      return new Promise((resolve, reject) => {
        faculty.restore(id).then(response => {
          resolve()
        })
      })
    },
    export({commit},payload){
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        faculty
          .export(payload)
          .then(response => {
            fileDownload(response,'faculties.xlsx');
            commit('SET_ITEMS_LOAD', false);
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  },
}

export default facultyModule
