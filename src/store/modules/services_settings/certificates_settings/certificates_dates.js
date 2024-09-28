import CertificatesDates from '../../../../api/services_settings/certificates_dates';
import fileDownload from 'js-file-download'

const CerDates = new CertificatesDates();

const certificatesDatesModule = {
  namespaced: true,
  state: {
    item: {},
    items: [],
    total: 0,
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
    certificatesDates({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        CerDates.list(payload.query)
          .then(response => {
            commit('SET_ITEMS', response.data);
            commit('SET_TOTAL_ITEMS', response.meta.count);
            commit('SET_ITEMS_LOAD', false);
            resolve();
          }).catch((err)=>{
          reject(err)
        });
      });
    },
    updateCertificatesDates({ commit }, payload) {
      commit('SET_ITEMS_LOAD', true);
      return new Promise((resolve, reject) => {
        CerDates.updateCertificatesDates(payload.id, payload.query)
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
    remove({ commit }, id) {
      return new Promise((resolve, reject) => {
        CerDates.remove(id).then(response => {
          resolve()
        })
      })
    },
    get({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        CerDates.get(payload.id, { year_id: payload.year_id })
          .then(response => {
            let shapedResponse = response.data;
            shapedResponse = {...response.data, amount:response.data.payment_settings ?response.data.payment_settings.value_usd:0,
              local_amount:response.data.payment_settings ?response.data.payment_settings.value_local:0};
              commit('SET_ITEM', shapedResponse);
            commit('SET_LOOKUPS',response.meta.lookups)
            commit('SET_ITEMS_LOAD', false);
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getLookups({ commit }, yearId) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        CerDates.lookups(yearId)
          .then(response => {
            // commit('SET_LOOKUPS',response)
            commit('SET_ITEMS_LOAD', false);
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
  }
}

export default certificatesDatesModule;