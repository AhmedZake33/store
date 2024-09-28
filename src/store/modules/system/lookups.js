import Lookup from '../../../api/system/lookups';

const lookup = new Lookup();

const lookupsModule = {
  namespaced: true,
  state: {
    lookups: null,
  },
  getters: {
    lookups(state) {
      return state.lookups
    },


  },
  mutations: {
    SET_LOOKUPS(state, lookups) {
      state.lookups = lookups;
    },
  },
  actions: {

    get({ commit },payload) {
      return new Promise((resolve, reject) => {
        lookup.get(payload)
          .then(response => {
            commit('SET_LOOKUPS', response.success);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  },
};

export default lookupsModule;
