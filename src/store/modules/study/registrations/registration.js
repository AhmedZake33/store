import Registration from '@/api/study/registrations/registration';

const fileDownload = require('js-file-download')

const registration = new Registration();

const registrationModule = {

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
        SET_ITEM: (state, user) => {
            state.item = user;
        },
        SET_LOOKUPS(state, lookups) {
            state.lookups = lookups;
        },
    },
    actions: {
        registrations({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                registration.list(payload.query)
                    .then(response => {
                        commit('SET_ITEMS', response.data);
                        commit('SET_TOTAL_ITEMS', response.meta.count);
                        commit('SET_LOOKUPS', response.meta.lookup);
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
            });
        },
        put({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                registration.put(payload.id, payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        get({commit}, id) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                registration.get(id).then(response => {
                    commit('SET_ITEM', response.data);
                    commit('app/UPDATE_PAGE_DETAILS', response.data.name, {root: true});
                    commit('SET_ITEMS_LOAD', false);
                    resolve();
                })
            });
        },
        remove({commit}, id) {
            return new Promise((resolve, reject) => {
                registration.remove(id).then(response => {
                    resolve();
                })
            });
        },
        restore({commit}, id) {
            return new Promise((resolve, reject) => {
                registration.restore(id).then(response => {
                    resolve();
                })
            });
        },
        export({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                registration.export(payload)
                    .then(response => {
                        fileDownload(response, 'registrations.xlsx');
                        commit('SET_ITEMS_LOAD', false);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        enrollStudents({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                registration.enrollStudents(payload)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        deleteRegistrations({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                registration.deleteRegistrations(payload)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
    },
};

export default registrationModule;
