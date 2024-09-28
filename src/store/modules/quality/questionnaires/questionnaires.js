import Questionnaires from '../../../../api/quality/questionnaires/questionnaires';

const questionnaires = new Questionnaires();

const questionnairesModule = {
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
    questionnaires({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        questionnaires.list(payload.query).then(response => {
          commit('SET_ITEMS', response.data);
          commit('SET_TOTAL_ITEMS', response.meta.count);
          commit('SET_ITEMS_LOAD', false);
          commit('SET_LOOKUPS', response.meta.lookup);
          resolve();
        });
      });
    },

    offeringQuestionnaires({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        questionnaires.offeringQuestionnaires(payload.query).then(response => {
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
        questionnaires.put(payload.id, payload.query)
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

    changeStatus({ commit }, payload) {
      commit('app/UPDATE_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        questionnaires.changeStatus(payload.id)
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

    submit({ commit }, payload) {
      commit('app/UPDATE_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        questionnaires.submit(payload.id, payload.query)
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

    getUsersAnswers({ commit }, payload) {
      commit('app/UPDATE_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        questionnaires.getUsersAnswers(payload.id)
            .then(response => {
              commit('app/UPDATE_LOAD', false, { root: true });
              resolve(response);
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
        questionnaires.get(payload)
            .then(response => {
              commit('SET_ITEM', response.data);
              response.data.name = response.data.questionnaire_type.name;
              response.data.name_local = response.data.questionnaire_type.name_local;
              commit('app/UPDATE_PAGE_DETAILS', response.data, { root: true });
              commit('SET_ITEMS_LOAD', false);
              resolve();
            })
            .catch(error => {
              reject(error);
            });
      });
    },

    getQuestionnaireLookups({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        questionnaires.getQuestionnaireLookups(payload)
            .then(response => {
              commit('SET_LOOKUPS', response.success);
              commit('SET_ITEMS_LOAD', false);
              resolve(response);
            })
            .catch(error => {
              reject(error);
            });
      });
    },

    getActiveQuestionnaires({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        questionnaires.getActiveQuestionnaires(payload)
            .then(response => {
              commit('SET_ITEMS', response);
              // response.data.name = response.data.questionnaire_type.name;
              // response.data.name_local = response.data.questionnaire_type.name_local;
              // commit('app/UPDATE_PAGE_DETAILS', response, { root: true });
              commit('SET_ITEMS_LOAD', false);
              resolve();
            })
            .catch(error => {
              reject(error);
            });
      });
    },

    getQuestionnaireStatistics({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        questionnaires.getQuestionnaireStatistics(payload.id,payload.query)
            .then(response => {
              commit('SET_ITEM', response.data);
              response.data.name = response.data.questionnaire_type.name;
              response.data.name_local = response.data.questionnaire_type.name_local;
              commit('app/UPDATE_PAGE_DETAILS', response.data, { root: true });
              commit('SET_LOOKUPS', response.meta.lookup);
              commit('SET_ITEMS_LOAD', false);
              resolve();
            })
            .catch(error => {
              reject(error);
            });
      });
    },

    getQuestions({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        questionnaires.getQuestions(payload)
            .then(response => {
              commit('SET_ITEMS', response);
              // response.data.name = response.data.questionnaire_type.name;
              // response.data.name_local = response.data.questionnaire_type.name_local;
              // commit('app/UPDATE_PAGE_DETAILS', response, { root: true });
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
        questionnaires.remove(id).then(response => {
          resolve();
        });
      });
    },

    restore({ commit }, id) {
      return new Promise((resolve, reject) => {
        questionnaires.restore(id).then(response => {
          resolve();
        });
      });
    },
  },
};

export default questionnairesModule;
