import Location from '../../../../api/administration/locations/locations';

const location = new Location();

const locationModule = {

  namespaced: true,

  state: {
    items: [],
    item: null,
    total: 0,
    lookups: null,
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
    
  },

  actions: {
    locations({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        location.list(payload.query)
          .then(response => {
            commit('SET_ITEMS', response.data);
            commit('SET_TOTAL_ITEMS', response.meta.count);
            commit('SET_ITEMS_LOAD', false);
            commit('SET_LOOKUPS', response.meta.lookup);
            resolve();
          });
      });
    },
    put({ commit }, payload) {
      commit('SET_ITEMS_LOAD', true);
      return new Promise((resolve, reject) => {
        location.put(payload.id, payload.query)
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
        location.get(payload)
          .then(response => {
            commit('SET_LOOKUPS', response.meta.lookup);
            commit('SET_ITEM', response.data);
            commit('app/UPDATE_PAGE_DETAILS', response.data, {root: true});
            commit('SET_ITEMS_LOAD', false);
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    deleteLocation({ commit }, payload){
      commit('SET_ITEMS_LOAD', true);
      return new Promise((resolve, reject) => {
        location.remove(payload)
          .then(response => {
            commit('SET_ITEMS_LOAD', false);
            resolve(response);
          })
          .catch(error => {
            commit('SET_ITEMS_LOAD', false);
            reject(error);
          });
      });
    }
  }

}

export default locationModule;
