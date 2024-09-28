import Excuse from '../../../../api/study/excuses/excuses';

const excuse = new Excuse();

const excuseModule = {

  namespaced: true,

  state: {
    items: [],
    item: null,
    total: 0,
    lookups: null,
    addlookups: null,
    load: false,
  },

  getters: {
    items(state) {
      return state.items;
    },
    item(state) {
      return state.item;
    },
    load(state) {
      return state.load;
    },
    total(state) {
      return state.total;
    },
    lookups(state) {
      return state.lookups;
    },
    getAddLookups(state) {
      return state.addlookups;
    },
  },

  mutations: {
    SET_ITEMS: (state, items) => {
      state.items = items;
    },
    SET_ITEM: (state, item) => {
      state.item = item;
    },
    SET_ITEMS_LOAD: (state, load) => {
      state.load = load;
    },
    SET_TOTAL_ITEMS: (state, total) => {
      state.total = total;
    },
    SET_LOOKUPS: (state, load) => {
      state.lookups = load;
    },
    SET_ADD_LOOKUPS: (state, load) => {
      state.addlookups = load;
    },
  },

  actions: {
    excuses({ commit },payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        excuse.list(payload.query)
          .then(response => {
            commit('SET_ITEMS', response.data);
            commit('SET_TOTAL_ITEMS', response.meta.count);
            commit('SET_ITEMS_LOAD', false);
            commit('SET_LOOKUPS', response.meta.lookup);
            resolve();
          });
      });
    },
    lookups({ commit }, ) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        excuse.getLookups()
          .then(response => {
            commit('SET_LOOKUPS', response.data);
            resolve(response);
            commit('SET_ITEMS_LOAD', false);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    put({ commit }, payload) {
      commit('SET_ITEMS_LOAD', true);
      return new Promise((resolve, reject) => {
        excuse.put(payload.id, payload.query)
          .then(response => {
            commit('SET_ITEMS_LOAD', false);
            resolve(response);
          })
          .catch(error => {
            commit('SET_ITEMS_LOAD', false);
            reject(error);
          });
      });
    },
    get({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        excuse.get(payload)
          .then(response => {
            commit('SET_ITEM', response.data);
            commit('SET_ITEMS_LOAD', false);
            commit('SET_LOOKUPS', response.meta.lookups);
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    updateStatus({ commit }, payload) {
      commit('SET_ITEMS_LOAD', true);
      return new Promise((resolve, reject) => {
        excuse.updateStatus(payload.id, payload.query)
          .then(response => {
            commit('SET_ITEMS_LOAD', false);
            resolve(response);
          })
          .catch(error => {
            commit('SET_ITEMS_LOAD', false);
            reject(error);
          });
      });
    },
  }

}

export default excuseModule;
