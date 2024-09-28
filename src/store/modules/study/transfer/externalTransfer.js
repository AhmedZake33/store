import fileDownload from "js-file-download";
import Transfer from '../../../../api/study/transfer/transfer';

const transfer_Student = new Transfer();

const externalTransferModule = {
  namespaced: true,
  state: {
    load: false,
    courseLoad: false,
    avalibleCourses: [],
    totalCourses: null,
    items: [],
    total: null,
    lookups: [],
    studentItem: null
  },
  getters: {
    avalibleCourses(state) {
      return state.avalibleCourses;
    },
    totalCourses(state) {
      return state.totalCourses;
    },
    studentItem(state) {
      return state.studentItem
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
    SET_STUDENT_ITEM(state, data) {
      state.studentItem = data
    }
  },
  actions: {
    getExternalStudentData({commit}, payload) {
      commit('SET_ITEMS_LOAD', true)
      return new Promise((resolve, reject) => {
        transfer_Student.getExternalStudentData(payload).then(response => {
          commit('SET_ITEMS_LOAD', false)
          commit('SET_STUDENT_ITEM', false)
          resolve(response.data);
        }).catch(error => {
          commit('SET_ITEMS_LOAD', false)
          reject(error && error.response && error.response.data && error.response.data.errors && error.response.data.errors[0]);
        });
      });
    },
    addExternalTransferInfo({ commit }, payload) {
      commit('SET_ITEMS_LOAD', true);
      return new Promise((resolve, reject) => {
        transfer_Student.addExternalTransferInfo(payload).then(response => {
          commit('SET_ITEMS_LOAD', false);
          resolve(response.data);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      });
    },
    editCourses({commit}, payload) {
      commit('SET_ITEMS_LOAD', true)
      return new Promise((resolve, reject) => {
        transfer_Student.editCourses(payload).then(response => {
          commit('SET_ITEMS_LOAD', false)
          resolve(response.data);
        }).catch(error => {
          commit('SET_ITEMS_LOAD', false)
          reject(error && error.response && error.response.data && error.response.data.errors && error.response.data.errors[0]);
        });
      });
    },
    addAbroadStudyCourse({commit}, payload) {
      commit('SET_ITEMS_LOAD', true)
      return new Promise((resolve, reject) => {
        transfer_Student.addAbroadStudyCourse(payload).then(response => {
          commit('SET_ITEMS_LOAD', false)
          resolve(response.data);
        }).catch(error => {
          commit('SET_ITEMS_LOAD', false)
          reject(error && error.response && error.response.data && error.response.data.errors && error.response.data.errors[0]);
        });
      });
    },
    getExternalStudentCourses({commit}, payload) {
      commit('SET_COURSES_LOAD', true)
      return new Promise((resolve, reject) => {
        transfer_Student.getExternalStudentCourses(payload).then(response => {
          commit('SET_COURSES_LOAD', false)
          commit('SET_AVALIBLE_COURSES', response.data);
          resolve(response);
        }).catch(error => {
          commit('SET_COURSES_LOAD', false)
          reject(error.response.data);
        });
      });
    },
    getProgramCourses({commit}, payload) {
      return new Promise((resolve, reject) => {
        transfer_Student.getExternalProgramCourses(payload).then(response => {
          commit('SET_AVALIBLE_COURSES', response.data);
          commit('SET_TOTAL_COURSES', response.meta.count);
          commit('SET_ITEMS_LOAD', false);
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      });
    },
    addTransferTempCourse({commit}, payload) {
      return new Promise((resolve, reject) => {
        transfer_Student.addExternalTransferTempCourse(payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      });
    },
    getTransferTempCourses({commit}, user_id) {
      return new Promise((resolve, reject) => {
        transfer_Student.getExternalTransferTempCourses(user_id).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      });
    },

    getTempCourseEquivalenceDetails({commit}, payload) {
      return new Promise((resolve, reject) => {
        transfer_Student.getExternalTempCourseEquivalenceDetails(payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      });
    },

    executeStudentTransfer({commit}, payload) {
      return new Promise((resolve, reject) => {
        transfer_Student.executeStudentExternalTransfer(payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      });
    },

    rejectTransferRequest({commit}, payload) {
      return new Promise((resolve, reject) => {
        transfer_Student.rejectTransferRequest(payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      });
    },

    listAllTransferRequests({commit}, query) {
      commit('SET_ITEMS_LOAD', true);
      return new Promise((resolve, reject) => {
        transfer_Student.listAllTransferRequests(query).then(response => {
          commit('SET_ITEMS', response.data);
          commit('SET_TOTAL_ITEMS', response.meta.count);
          commit('SET_LOOKUPS', response.meta.lookup);
          commit('SET_ITEMS_LOAD', false);
          resolve(response);
        }).catch(error => {
          commit('SET_ITEMS_LOAD', false);
          reject(error.response.data.errors[0]);
        });
      });
    },
  },
};

export default externalTransferModule;
