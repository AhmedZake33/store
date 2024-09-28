import Dashboard from '../../../api/system/dashboard';

const dashboard = new Dashboard();

const locationModule = {
  namespaced: true,
  state: {
    activities: null,
    counts: null,
    payment: null,
    paymentDollar: null,
    faculty:null,
    offering_statistics:null,
  },
  getters: {
    counts(state) {
      return state.counts
    },
    faculty(state) {
      return state.faculty
    },
    offering_statistics(state) {
      return state.offering_statistics
    },
    payment(state) {
      return state.payment
    },
    paymentDollar(state) {
      return state.paymentDollar
    },
    activities(state) {
      return state.activities
    },

  },
  mutations: {
    SET_COUNTS(state, counts) {
      state.counts = counts;
    },
    SET_FACULTY(state, faculty) {
      state.faculty = faculty;
    },
    SET_ACTIVITIES(state, activities) {
      state.activities = activities;
    },
    SET_PAYMENT(state, payment) {
      state.payment = payment;
    },
    SET_PAYMENTDollar(state, paymentDollar) {
      state.paymentDollar = paymentDollar;
    },
    SET_OFFERING_STATISTICS(state, data){
      state.offering_statistics = data
    }
  },
  actions: {

    counts({ commit }) {
      return new Promise((resolve, reject) => {
        dashboard.counts()
          .then(response => {
            commit('SET_COUNTS', response.data);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    offering_statistics({ commit },id) {
      commit('app/UPDATE_LOAD', true, { root: true })
      return new Promise((resolve, reject) => {
        dashboard.offering_statistics(id)
            .then(response => {
              commit('SET_OFFERING_STATISTICS', response.data);
              commit('app/UPDATE_LOAD', false, { root: true })
              resolve();
            })
            .catch(error => {
              commit('app/UPDATE_LOAD', false, { root: true })
              reject(error);
            });
      });
    },
    // {{server}}/offerings/statistics/1902
    faculty({ commit }) {
      commit('app/UPDATE_LOAD', true, { root: true })
      return new Promise((resolve, reject) => {
        dashboard.faculty()
        .then(response => {
          commit('SET_FACULTY', response.data);
              commit('app/UPDATE_LOAD', false, { root: true })
              resolve();
            })
            .catch(error => {
              commit('app/UPDATE_LOAD', false, { root: true })
              reject(error);
            });
      });
    },

    Activities({ commit }) {
      return new Promise((resolve, reject) => {
        dashboard.Activities()
          .then(response => {
            commit('SET_ACTIVITIES', response.data.activities_per_month);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    paymentPerMonth({ commit }) {
      return new Promise((resolve, reject) => {
        dashboard
          .paymentPerMonth()
          .then(response => {
            commit('SET_PAYMENT', response.data.payments_per_faculty);
            commit('SET_PAYMENTDollar', response.data.payments_per_faculty_dollar);

            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    
  },
};

export default locationModule;
