import fileDownload from "js-file-download";
import Transfer from '../../../../api/study/transfer/transfer';

const transfer_Student = new Transfer();

const transferModule = {
  namespaced: true,
  state: {

    load: false,
    courseLoad: false,
    avalibleCourses:[],
    totalCourses: null,
    items:[],
    total:null,
    lookups:[]
  },
  getters: {
    avalibleCourses(state){
      return state.avalibleCourses;
    },
    totalCourses(state){
      return state.totalCourses;
    },
    load(state) {
        return state.load;
    },
    total(state) {
        return state.total;
    },
    items(state) {
      return state.items;
    },
    lookups(state) {
      return state.lookups;
    },
    courseLoad(state) {
      return state.courseLoad
    }
  },
  mutations: {

    SET_ITEMS_LOAD: (state, load) => {
        state.load = load;
    },
    SET_COURSES_LOAD: (state, load) => {
      state.courseLoad = load;
    },
    SET_TOTAL_COURSES: (state, totalCourses) => {
      state.totalCourses = totalCourses;
    },
    SET_AVALIBLE_COURSES: (state, avalibleCourses) => {
      state.avalibleCourses = avalibleCourses;
    },
    SET_ITEMS: (state, users) => {
      state.items = users;
    },
    SET_TOTAL_ITEMS: (state, total) => {
        state.total = total;
    },
    SET_LOOKUPS(state, lookups) {
        state.lookups = lookups;
    },

  },
  actions: {
    getInternalStudentData({ commit }, payload) {
      return new Promise((resolve, reject) => {
        transfer_Student.getInternalStudentData(payload).then(response => {
          resolve(response.data);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      });
    },

    getTransferAvailableCourses({ commit }, payload) {
        return new Promise((resolve, reject) => {
          transfer_Student.getTransferAvailableCourses(payload).then(response => {
            resolve(response);
          }).catch(error => {
            reject(error.response.data.errors[0]);
          });
        });
    },
    getProgramCourses({ commit }, payload) {
      return new Promise((resolve, reject) => {
        transfer_Student.getProgramCourses(payload).then(response => {
          commit('SET_AVALIBLE_COURSES', response.data.data);
          commit('SET_TOTAL_COURSES', response.data.count);
          commit('SET_ITEMS_LOAD', false);
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      });
  },
    addTransferTempCourse({ commit }, payload) {
        return new Promise((resolve, reject) => {
          transfer_Student.addTransferTempCourse(payload).then(response => {
            resolve(response);
          }).catch(error => {
            reject(error.response.data.errors[0]);
          });
        });
    },
    getTransferTempCourses({ commit }, transfer_id) {
        return new Promise((resolve, reject) => {
          transfer_Student.getTransferTempCourses(transfer_id).then(response => {
            resolve(response);
          }).catch(error => {
            reject(error.response.data.errors[0]);
          });
        });
    },

    getTempCourseEquivalenceDetails({ commit }, payload) {
      return new Promise((resolve, reject) => {
        transfer_Student.getTempCourseEquivalenceDetails(payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      });
  },

    executeStudentTransfer({ commit }, payload) {
        return new Promise((resolve, reject) => {
          transfer_Student.executeStudentTransfer(payload).then(response => {
            resolve(response);
          }).catch(error => {
            reject(error.response.data.errors[0]);
          });
        });
    },

    rejectTransferRequest({ commit }, payload) {
      return new Promise((resolve, reject) => {
        transfer_Student.rejectTransferRequest(payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      });
  },

    listAllTransferRequests({ commit }, query) {
      return new Promise((resolve, reject) => {
        transfer_Student.listAllTransferRequests(query).then(response => {
          commit('SET_ITEMS', response.data);
          commit('SET_TOTAL_ITEMS', response.meta.count);
          commit('SET_LOOKUPS', response.meta.lookup);
          commit('SET_ITEMS_LOAD', false);
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      });
    },
    getTransferDetails({ commit },payload){
      return new Promise((resolve, reject) => {
        transfer_Student.showInternalDetails(payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      });
    },
    getTransferLookups({ commit },payload){
      return new Promise((resolve, reject) => {
        transfer_Student.transferLookups(payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      });
    },
    editTransfer({commit},payload){
      return new Promise((resolve, reject) => {
        transfer_Student.editTransfer(payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      });
    },
    addTransferRequest({ commit }, payload) {
      return new Promise((resolve, reject) => {
        transfer_Student.SendRequest(payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      });
    },
    deleteTransfer({ commit },transfer_id) {
      return new Promise((resolve, reject) => {
        transfer_Student.deleteTransfer(transfer_id).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      });
    },
  },
};

export default transferModule;
