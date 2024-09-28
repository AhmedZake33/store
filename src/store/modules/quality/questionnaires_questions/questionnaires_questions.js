import QuestionnairesQuestions from '../../../../api/quality/questionnaires_questions/questionnaires_questions';

const questionnairesQuestions = new QuestionnairesQuestions();

const questionnairesQuestionsModule = {
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
    questionnairesQuestions({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        questionnairesQuestions.list(payload.query).then(response => {
          commit('SET_ITEMS', response.data);
          commit('SET_TOTAL_ITEMS', response.meta.count);
          commit('SET_ITEMS_LOAD', false);
          commit('SET_LOOKUPS', response.meta.lookup);
          resolve();
        });
      });
    },

    reorderQuestion({ commit }, payload) {
      commit('app/UPDATE_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        questionnairesQuestions.reorderQuestion(payload.query.first.id , payload.query.second.order)
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

    put({ commit }, payload) {
      commit('app/UPDATE_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        questionnairesQuestions.put(payload.id, payload.query)
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

    get({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        questionnairesQuestions.get(payload)
            .then(response => {
              commit('SET_ITEM', response.data);
              response.data.name = response.data.question;
              response.data.name_local = response.data.question_local;
              commit('app/UPDATE_PAGE_DETAILS', response.data, { root: true });
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
        questionnairesQuestions.remove(id).then(response => {
          resolve();
        });
      });
    },

    restore({ commit }, id) {
      return new Promise((resolve, reject) => {
        questionnairesQuestions.restore(id).then(response => {
          resolve();
        });
      });
    },
  },
};

export default questionnairesQuestionsModule;
