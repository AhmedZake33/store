import paymentItems from '@/api/student/payments/payment_items';

const payment_items = new paymentItems();

const paymentItemsModule = {

  namespaced: true,
  state: {
    item: null,
    items: [],
    total: 0,
    lookups: null,
    details: null,
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
    details(state) {
      return state.details;
    },

  },
  mutations: {
    SET_ITEMS: (state, users) => {
      state.items = users;
    },
    SET_TOTAL_ITEMS: (state, total) => {
      state.total = total;
    },
    SET_ITEMS_LOAD: (state, load) => {
      state.load = load;
    },
    SET_ITEM: (state, user) => {
      state.item = user;
    },
    SET_LOOKUPS(state, lookups) {
      state.lookups = lookups;
    },
    SET_DETAILS(state, details) {
      state.details = details;
    },
  },
  actions: {
    paymentItems({commit}, payload) {
      return new Promise((resolve, reject) => {
      commit('SET_ITEMS_LOAD', true);
        payment_items.list(payload.id,payload.query)
          .then(response => {
            commit('SET_ITEMS', response.data);
            commit('SET_TOTAL_ITEMS', response.meta.count);
            commit('SET_ITEMS_LOAD', false);
            // const breadCrump = { code: response.data.user.code,name:response.data.user ? response.data.user.name : '', name_local: response.data.user.name_local ? response.data.user.name_local: ''}
            // commit('app/UPDATE_PAGE_DETAILS', breadCrump, {root: true});
            resolve();
          }).catch((e)=>{
            commit('SET_ITEMS_LOAD', false);
            reject(e);
        })
      });
    },
    paymentRefundItems({commit}, payload) {
      return new Promise((resolve, reject) => {
      commit('SET_ITEMS_LOAD', true);
        payment_items.paymentRefundItems(payload.id,payload.query)
          .then(response => {
            commit('SET_ITEMS', response.success);
            // commit('SET_TOTAL_ITEMS', response.meta.count);
            commit('SET_ITEMS_LOAD', false);
            // const breadCrump = { code: response.data.user.code,name:response.data.user ? response.data.user.name : '', name_local: response.data.user.name_local ? response.data.user.name_local: ''}
            // commit('app/UPDATE_PAGE_DETAILS', breadCrump, {root: true});
            resolve();
          }).catch((e)=>{
            commit('SET_ITEMS_LOAD', false);
            reject(e);
        })
      });
    },
    put({commit}, payload) {
      commit('app/UPDATE_LOAD', true, {root: true});
      return new Promise((resolve, reject) => {
        payment_items.put(payload.id, payload.data).then(response => {
          commit('SET_ITEMS', response.data.items);
          commit('SET_ITEMS_LOAD', false);
          resolve();
        }).catch(error => {
          commit('SET_ITEMS_LOAD', false);
          reject(error);
        });
      });
    },
    editPaymentItem({commit}, payload) {
        commit('app/UPDATE_LOAD', true, {root: true});
        return new Promise((resolve, reject) => {
          payment_items.editPaymentItem(payload.id, payload.data).then(response => {
                commit('app/UPDATE_LOAD', false, {root: true});
                resolve();
            }).catch(error => {
                commit('app/UPDATE_LOAD', false, {root: true});
                reject(error);
            });
        });
    },
    // refund({commit}, payload) {
    //   commit('app/UPDATE_LOAD', true, {root: true});
    //   return new Promise((resolve, reject) => {
    //     payment.refund(payload.query).then(response => {
    //       commit('app/UPDATE_LOAD', false, {root: true});
    //       resolve();
    //     }).catch(error => {
    //       commit('app/UPDATE_LOAD', false, {root: true});
    //       reject(error);
    //     });
    //   });
    // },
    // putTransaction({commit}, payload) {
    //   commit('app/UPDATE_LOAD', true, {root: true});
    //   return new Promise((resolve, reject) => {
    //     payment.putTransaction(payload.id, payload.query).then(response => {
    //       commit('app/UPDATE_LOAD', false, {root: true});
    //       resolve();
    //     }).catch(error => {
    //       commit('app/UPDATE_LOAD', false, {root: true});
    //       reject(error);
    //     });
    //   });
    // },
    // get({commit}, id) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_ITEMS_LOAD', true);
    //     payment.get(id).then(response => {
    //       commit('SET_ITEM', response.data);
    //       commit('SET_ITEMS_LOAD', false);
    //       resolve();
    //     })
    //   });
    // },
    // remove({commit}, id) {
    //   return new Promise((resolve, reject) => {
    //     payment.remove(id).then(response => {
    //       resolve();
    //     })
    //   });
    // },
    // restore({commit}, id) {
    //   return new Promise((resolve, reject) => {
    //     payment.restore(id).then(response => {
    //       resolve();
    //     })
    //   });
    // },
  },
};

export default paymentItemsModule;
