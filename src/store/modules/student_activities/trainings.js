import Training from '@/api/student_activities/trainings';

const training = new Training();

const trainingModule = {

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
        SET_ITEMS: (state, users) => {
            state.items = users;
        },
        SET_TOTAL_ITEMS: (state, total) => {
            state.total = total;
        },
        SET_ITEMS_LOAD: (state, load) => {
            state.load = load;
        },
        SET_ITEM: (state, data) => {
            state.item = data;
        },
        SET_LOOKUPS(state, lookups) {
            state.lookups = lookups;
        },

    },
    actions: {
        trainings({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                training.list(payload.query)
                    .then(response => {
                        commit('SET_ITEMS', response.data);
                        commit('SET_TOTAL_ITEMS', response.meta.count);
                        commit('SET_LOOKUPS', response.meta.lookup);
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
            });
        },
        lookups({ commit }) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                training.lookups()
                    .then(response => {
                        commit('SET_LOOKUPS', response.data);
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
            });
        },
        put({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                training.put(payload.id, payload.query).then(response => {
                    commit('SET_ITEMS_LOAD', false);
                    resolve();
                }).catch(error => {
                    commit('SET_ITEMS_LOAD', false);
                    reject(error);
                });
            });
        },
        get({ commit }, id) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                training.get(id).then(response => {
                    commit('SET_ITEM', response.data);
                    if (response && response.data && typeof response.data == 'object') {
                        commit('app/UPDATE_PAGE_DETAILS', response.data, { root: true });
                    }
                    commit('SET_ITEMS_LOAD', false);
                    resolve();
                })
            });
        },
        remove({ commit }, id) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                training.remove(id).then(response => {
                    commit('SET_ITEMS_LOAD', false);
                    resolve(response);
                })
            });
        },
        restore({ commit }, id) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                training.restore(id).then(response => {
                    commit('SET_ITEMS_LOAD', false);
                    resolve();
                })
            });
        },
        trainingStudents({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                training.students(payload.query)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    }).catch(error => {
                        commit('SET_ITEMS_LOAD', false);
                        reject(error);
                    });
            });
        },

        studentTraining({ commit }, training_student_id) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                training.studentTraining(training_student_id)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false);
                        if (response && response.data && typeof response.data == 'object') {
                            commit('app/UPDATE_PAGE_DETAILS', response.data, { root: true });
                        }
                        resolve(response);
                    }).catch(error => {
                        commit('SET_ITEMS_LOAD', false);
                        reject(error);
                    });
            });
        },

        searchForStudent({ commit }, payload) {
            return new Promise((resolve, reject) => {
                training.searchForStudent(payload).then(response => {
                    resolve(response.data);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        addStudentToTraining({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                training.addStudentToTraining(payload).then(response => {
                    commit('SET_ITEMS_LOAD', false);
                    resolve();
                }).catch(error => {
                    commit('SET_ITEMS_LOAD', false);
                    reject(error);
                });
            });
        },

        updateStudentTrainingStatus({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                training.updateStudentTrainingStatus(payload).then(response => {
                    commit('SET_ITEMS_LOAD', false);
                    resolve(response);
                }).catch(error => {
                    commit('SET_ITEMS_LOAD', false);
                    reject(error);
                });
            });
        }
    },
};

export default trainingModule;
