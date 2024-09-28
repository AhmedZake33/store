import OfferingsRegistration from '../../../../api/student/registrations/registration';
import fileDownload from "js-file-download";

const offerings_registration = new OfferingsRegistration();

const offeringsRegistrationModule = {
  namespaced: true,
  state: {
    selectedCourses: null,
    termsGrades:{},
    takenCourses:{},
    load:false,
  },
  getters: {
    termsGrades(state) {
      return state.termsGrades;
    },
    takenCourses(state) {
      return state.takenCourses;
    },
    load(state) {
      return state.load;
  },
  },
  mutations: {
    SET_ITEMS: (state, users) => {
      state.items = users;
    },
    SET_TERMS_GRADES:(state,termsGrades) => {
      state.termsGrades=termsGrades;
    },
    SET_ITEMS_LOAD: (state, load) => {
      state.load = load;
  },
    SET_TAKEN_COURSES:(state,takenCourses) => {
      state.takenCourses=takenCourses;
    }
  },
  actions: {
    export({commit}, payload) {
      return new Promise((resolve, reject) => {
          commit('SET_ITEMS_LOAD', true);
          offerings_registration
              .export(payload)
              .then(response => {
                  fileDownload(response, payload.excel_name ? `${payload.excel_name}.xlsx` : 'advisors.xlsx');
                  commit('SET_ITEMS_LOAD', false);
                  resolve(response);
              })
              .catch(error => {
                  reject(error);
              });
      });
  },
    getSelectedCourseDetails({ commit }, payload) {
      return new Promise((resolve, reject) => {
        // commit('SET_ITEMS_LOAD', true);
        offerings_registration.getSelectedCourses(payload.id, payload).then(response => {
          // commit('SET_ITEMS', response.data);
          resolve(response.data);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      });
    },
    getCurrentTermStage({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offerings_registration.getCurrentTermStage(payload.id).then(response => {
          resolve(response.data);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      });
    },
    getAvailableCourses({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offerings_registration.getAvailableCourses(payload.id,payload.payload).then(response => {
          resolve(response);
        });
      });
    },
    requestNewOffering({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offerings_registration.requestNewOffering(payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      })
    },
    offeringSections({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offerings_registration.offeringSections(payload).then(response => {
          resolve(response.data);
        });
      });
    },
    removeRequestedOffering({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offerings_registration.removeRequestedOffering(payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      })
    },
    acceptRequestedOffering({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offerings_registration.acceptRequestedOffering(payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      })
    },
    rejectRequestedOffering({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offerings_registration.rejectRequestedOffering(payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      })
    },
    withdrawRequestedOffering({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offerings_registration.withdrawRequestedOffering(payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      })
    },
    addDropRequestedOffering({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offerings_registration.addDropRequestedOffering(payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      })
    },
    acceptAllRequestedOfferings({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offerings_registration.acceptAllRequestedOfferings(payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      })
    },
    undoToRegisteredOffering({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offerings_registration.undoToRegisteredOffering(payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      })
    },
    updateStatusOffering({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offerings_registration.updateStatusOffering(payload.status, payload.payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      })
    },
    getAdvisingStudents({ commit }, payload) {
      commit('SET_ITEMS_LOAD', true);
      return new Promise((resolve, reject) => {
        offerings_registration.getAdvisingStudents(payload).then(response => {
          resolve(response);
          commit('SET_ITEMS_LOAD', false);
        })
      })
    },
    printRegistrationData({ commit }, query) {
      return new Promise((resolve, reject) => {
        const fileName = query.student.label + ' ' + query.student.name + ' ' + query.student.code + '.pdf'
        offerings_registration
            .printData(query)
            .then(response => {
              fileDownload(response, fileName)
              resolve(true)
            })
            .catch(error => {
              reject(error);
            })
      })
    },
    getTermsGrades({commit},payload){
      return new Promise((resolve, reject) => {
        offerings_registration
            .getTermsGrades(payload)
            .then(response => {
              commit('SET_TERMS_GRADES', response.data);

              resolve(response);
            })
            .catch(error => {
              reject(error);
            })
      })
    },
    getTakenCourses({commit},payload){
      return new Promise((resolve, reject) => {
        offerings_registration
            .getTakenCourses(payload)
            .then(response => {
              commit('SET_TAKEN_COURSES', response.data);

              resolve(response);
            })
            .catch(error => {
              reject(error);
            })
      })
    },
    getStudyPlan({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offerings_registration.getStudyPlan(payload).then(response => {
          resolve(response.data);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      });
    },
    changeOfferingSection({ commit }, payload) {
      return new Promise((resolve, reject) => {
        offerings_registration.changeOfferingSection(payload).then(response => {
          resolve(response);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      })
    },
    getStudentTerms({ commit }, studentId) {
      return new Promise((resolve, reject) => {
        offerings_registration.studentRegistrationTerms(studentId).then(response => {
          resolve(response.data);
        }).catch(error => {
          reject(error.response.data.errors[0]);
        });
      })
    },
  },
};

export default offeringsRegistrationModule;
