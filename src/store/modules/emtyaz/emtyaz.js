import Emtyaz from '../../../api/emtyaz/emtyaz'

const EmtyazData = new Emtyaz();

const EmtyazModlue = {
  namespaced: true,
  state: {
    items: [],
    load: false,
    totalCourses: null,
    item: null,
    lookups: null,
  },
  getters: {
    items(state) {
      return state.items;
    },
    load(state) {
      return state.load;
    },
    totalCourses(state) {
      return state.totalCourses;
    },
    item(state) {
      return state.item;
    },
    lookups(state) {
      return state.lookups;
    },
  },
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items;
    },
    SET_LOAD(state, load) {
      state.load = load;
    },
    SET_TOTAL_COURSES(state, totalCourses) {
      state.totalCourses = totalCourses;
    },
    SET_ITEM(state, item) {
      state.item = item;
    },
    SET_LOOKUPS(state, lookups) {
      state.lookups = lookups;
    },
  },
  actions: {
    offerings({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD', true);
        EmtyazData.offerings(payload)
          .then((response) => {
            resolve(response);
            commit('SET_ITEMS', response.data);
            commit('SET_TOTAL_COURSES', response.meta.count);
            commit('SET_LOOKUPS', response.meta.lookup);
            commit('SET_LOAD', false);
          })
          .catch((error) => {
            commit('SET_LOAD', false);
            reject(error);
          });
      });
    },
    courses({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD', true);
        EmtyazData.courses(payload)
          .then((response) => {
            resolve(response);
            commit('SET_ITEMS', response.data);
            commit('SET_TOTAL_COURSES', response.meta.count);
            commit('SET_LOOKUPS', response.meta.lookup);
            commit('SET_LOAD', false);
          })
          .catch((error) => {
            commit('SET_LOAD', false);
            reject(error);
          });
      });
    },
    trainings({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD', true);
        EmtyazData.trainings(payload)
          .then((response) => {
            resolve(response);
            commit('SET_ITEMS', response.data);
            commit('SET_TOTAL_COURSES', response.meta.count);
            commit('SET_LOAD', false);
          })
          .catch((error) => {
            commit('SET_LOAD', false);
            reject(error);
          });
      });
    },
    registrations({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD', true);
        EmtyazData.registrations(payload)
          .then((response) => {
            resolve(response);
            commit('SET_ITEMS', response.data);
            commit('SET_TOTAL_COURSES', response.meta.count);
            commit('SET_LOAD', false);
          })
          .catch((error) => {
            commit('SET_LOAD', false);
            reject(error);
          });
      });
    },
    addTrainingEmtyaz({ commit }, payload) {
      return new Promise((resolve, reject) => {
        EmtyazData.addTrainingEmtyaz(payload)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error.response.data.errors[0]);
          });
      });
    },
    getAvailableTrainings({ commit }, payload) {
      return new Promise((resolve, reject) => {
        EmtyazData.getAvailableTrainings(payload).then((response) => {
          resolve(response);
        });
      });
    },
    acceptAllRequestedEmtyaz({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offerings_registration
          .acceptAllRequestedEmtyaz(payload)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error.response.data.errors[0]);
          });
      });
    },
    getSelectedEmtyazDetails({ commit }, payload) {
      return new Promise((resolve, reject) => {
        // commit('SET_ITEMS_LOAD', true);
        EmtyazData.getSelectedEmtyaz(payload)
          .then((response) => {
            // commit('SET_ITEMS', response.data);
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response.data.errors[0]);
          });
      });
    },
    acceptRequestedEmtyaz({ commit }, payload) {
      return new Promise((resolve, reject) => {
        EmtyazData.acceptRequestedEmtyaz(payload)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error.response.data.errors[0]);
          });
      });
    },
    removeRequestedEmtyaz({ commit }, payload) {
      return new Promise((resolve, reject) => {
        EmtyazData.removeRequestedEmtyaz(payload)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error.response.data.errors[0]);
          });
      });
    },
    rejectRequestedEmtyaz({ commit }, payload) {
      return new Promise((resolve, reject) => {
        EmtyazData.rejectRequestedEmtyaz(payload)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error.response.data.errors[0]);
          });
      });
    },

    lookups({ commit }, query) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        EmtyazData.lookup(query.query).then((response) => {
          commit('SET_LOOKUPS', response.data);
          commit('SET_ITEMS_LOAD', false);
          resolve(response);
        });
      });
    },
    getCourse({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD', true);
        EmtyazData.getCourse(id)
          .then((response) => {
            resolve(response);
            commit('SET_ITEM', response.data);
            commit('SET_LOAD', false);
          })
          .catch((error) => {
            commit('SET_LOAD', false);
            reject(error);
          });
      });
    },
    putCourse({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD', true);
        EmtyazData.putCourse(payload)
          .then((response) => {
            commit('SET_ITEM', response.data);
            commit('SET_LOAD', false);
            resolve(response);
          })
          .catch((error) => {
            commit('SET_LOAD', false);
            reject(error);
          });
      });
    },
    putTrainingType({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD', true);
        EmtyazData.putTrainingType(payload)
          .then((response) => {
            commit('SET_ITEM', response.data);
            commit('SET_LOAD', false);
            resolve(response);
          })
          .catch((error) => {
            commit('SET_LOAD', false);
            reject(error);
          });
      });
    },
    deleteTraining({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD', true);
        EmtyazData.deleteTraining(payload)
          .then((response) => {
            resolve(response);
            commit('SET_LOAD', false);
          })
          .catch((error) => {
            commit('SET_LOAD', false);
            reject(error);
          });
      });
    },
    deleteTrainingType({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD', true);
        EmtyazData.deleteTrainingType(payload)
          .then((response) => {
            resolve(response);
            commit('SET_LOAD', false);
          })
          .catch((error) => {
            commit('SET_LOAD', false);
            reject(error);
          });
      });
    },
    offering_mark({ commit }, id) {
      return new Promise((resolve, reject) => {
        EmtyazData.offering_mark(id)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    updateStudentGradeFromExcel({ commit, state }, resource) {
      commit('app/UPDATE_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        EmtyazData.updateStudentGradeFromExcel(resource)
          .then((response) => {
            commit('app/UPDATE_LOAD', false, { root: true });
            resolve(response);
          })
          .catch((error) => {
            commit('app/UPDATE_LOAD', false, { root: true });
            reject(error);
          });
      });
    },
    statusSubmit({ commit }, id) {
      return new Promise((resolve, reject) => {
        EmtyazData.statusSubmit(id)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    get({ commit }, query) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        if (typeof query === 'object') {
          EmtyazData.get(query.id, {
            get_edit: query.get_edit,
          }).then((response) => {
            commit('SET_ITEM', response.data);
            if (response && response.data && typeof response.data == 'object') {
              commit(
                'app/UPDATE_PAGE_DETAILS',
                { ...response.data.course, print_code: true },
                { root: true }
              );
            }
            commit('SET_ITEMS_LOAD', false);
            resolve();
          });
        } else {
          EmtyazData.get(query).then((response) => {
            commit('SET_ITEM', response.data);
            commit(
              'app/UPDATE_PAGE_DETAILS',
              { ...response.data.course, print_code: true },
              {
                root: true,
              }
            );
            commit('SET_ITEMS_LOAD', false);
            resolve(response);
          });
        }
      });
    },

    getInstructors({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD', true);
        EmtyazData.getInstructors(payload)
          .then((response) => {
            resolve(response);
            commit('SET_LOAD', false);
          })
          .catch((error) => {
            commit('SET_LOAD', false);
            reject(error);
          });
      });
    },

    addTrainingInstructors({ commit }, payload) {
      return new Promise((resolve, reject) => {
        EmtyazData.addTrainingInstructors(payload)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    removeInstructor({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD', true);
        EmtyazData.removeInstructor(payload)
          .then((response) => {
            resolve(response);
            commit('SET_LOAD', false);
          })
          .catch((error) => {
            commit('SET_LOAD', false);
            reject(error);
          });
      });
    },
    getTraining({ commit }, payload) {
      return new Promise((resolve, reject) => {
        EmtyazData.getTraining(payload).then((response) => {
          resolve(response);
          commit('SET_ITEM', response);
          commit('SET_LOAD', false);
        });
      });
    },

    updateTraining({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD', true);
        EmtyazData.updateTraining(payload)
          .then((response) => {
            commit('SET_ITEM', response.data);
            commit('SET_LOAD', false);
            resolve(response);
          })
          .catch((error) => {
            commit('SET_LOAD', false);
            reject(error.response.data.errors[0]);
          });
      });
    },

    getTrainingInstructors({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD', true);
        EmtyazData.getTrainingInstructors(payload)
          .then((response) => {
            resolve(response);
            commit('SET_INSTRUCTORS', response.data);
            commit('SET_LOAD', false);
          })
          .catch((error) => {
            commit('SET_LOAD', false);
            reject(error);
          });
      });
    },
  },
};

export default EmtyazModlue;
