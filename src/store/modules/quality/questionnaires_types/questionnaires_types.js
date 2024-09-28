import QuestionnairesTypes from '../../../../api/quality/questionnaires_types/questionnaires_types';

const questionnairesTypes = new QuestionnairesTypes();

const questionnairesTypesModule = {
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
    status(state) {
      return state.item.removed;
    },
    lookups(state) {
      return state.lookups;
    },
  },
  mutations: {
    SET_ITEMS: (state, items) => {
      state.items = items;
    },
    SET_TOTAL_ITEMS: (state, total) => {
      state.total = total;
    },
    SET_ITEMS_LOAD: (state, load) => {
      state.load = load;
    },
    SET_ITEM: (state, item) => {
      state.item = item;
    },
    SET_LOOKUPS(state, lookups) {
      state.lookups = lookups;
    },
  },
  actions: {
    questionnairesTypes({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        questionnairesTypes.list(payload.query).then(response => {
          commit('SET_ITEMS', response.data);
          commit('SET_TOTAL_ITEMS', response.meta.count);
          commit('SET_ITEMS_LOAD', false);
          commit('SET_LOOKUPS', response.meta.lookup);
          resolve();
        });
      });
    },

    put({ commit }, payload) {
      commit('app/UPDATE_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        questionnairesTypes.put(payload.id, payload.query)
            .then(response => {
              commit('app/UPDATE_LOAD', false, { root: true });
              resolve();
            })
            .catch(error => {
              commit('app/UPDATE_LOAD', false, { root: true });
              reject(error);
            });
      });
    },

    get({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        questionnairesTypes.get(payload)
            .then(response => {
              commit('SET_ITEM', response.data);
              commit('app/UPDATE_PAGE_DETAILS', response.data, { root: true });
              commit('SET_ITEMS_LOAD', false);
              resolve();
            })
            .catch(error => {
              reject(error);
            });
      });
    },

    remove({ commit }, id) {
      return new Promise((resolve, reject) => {
        questionnairesTypes.remove(id).then(response => {
          resolve();
        });
      });
    },

    restore({ commit }, id) {
      return new Promise((resolve, reject) => {
        questionnairesTypes.restore(id).then(response => {
          resolve();
        });
      });
    },
  },
};

export default questionnairesTypesModule;
