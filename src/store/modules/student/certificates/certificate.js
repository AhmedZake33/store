import Certificate from '../../../../api/student/certificates/certificate';

const certificate = new Certificate();

const certificateModule = {
  namespaced: true,
  state: {
    item: {},
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
    certificates({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        certificate.list(payload.query)
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
        certificate.put(payload.id, payload.query)
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
        certificate.get(payload)
          .then(response => {
            commit('SET_ITEM', response.data);
            commit('SET_ITEMS_LOAD', false);
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    remove({ commit }, id) {
      return new Promise((resolve, reject) => {
        certificate.remove(id)
          .then(response => {
            resolve();
          });
      });
    },
    restore({ commit }, id) {
      return new Promise((resolve, reject) => {
        certificate.restore(id)
          .then(response => {
            resolve();
          });
      });
    },
    updateStudent({ commit }, payload) {
      commit("SET_ITEMS_LOAD", true);
      return new Promise((resolve, reject) => {
        certificate.updateStudent(payload)
          .then(response => {
            commit("SET_ITEMS_LOAD", false);
            resolve(response);
          })
          .catch(error => {
            commit("SET_ITEMS_LOAD", false);
            reject(error);
          });
      });
    },
    checkBankMisrPaymentStatus({ commit }, payload) {
      commit("SET_ITEMS_LOAD", true);
      return new Promise((resolve, reject) => {
        certificate.checkBankMisrPaymentStatus(payload)
          .then(response => {
            resolve(response);
            commit("SET_ITEMS_LOAD", false);
          })
          .catch(error => {
            reject(error);
            commit("SET_ITEMS_LOAD", false);
          });
      });
    },

    changeStudentName({ commit }, payload) {
      commit("SET_ITEM_LOAD", true)
      return new Promise((resolve, reject) =>
        certificate.changeName(payload)
          .then(response => {
            resolve(response)
            commit("SET_ITEMS_LOAD", false);
          })
          .catch(error => {
            reject(error)
            commit("SET_ITEMS_LOAD", false);
          })
      );
    },

  }

}


export default certificateModule;
