import PapersTypes from '@/api/examination/papers_types/papers_types.js';

const papersTypes = new PapersTypes();

const papersTypesModule = {

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
        papersTypes({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                papersTypes.list(payload.query)
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
                papersTypes.lookups()
                    .then(response => {
                        commit('SET_LOOKUPS', response.data.lookups);
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
            });
        },
        put({ commit }, payload) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                papersTypes.put(payload.id, payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, { root: true });
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, { root: true });
                    reject(error);
                });
            });
        },
        get({ commit }, id) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                papersTypes.get(id).then(response => {
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
                papersTypes.remove(id).then(response => {
                    resolve();
                })
            });
        },
        restore({ commit }, id) {
            return new Promise((resolve, reject) => {
                papersTypes.restore(id).then(response => {
                    resolve();
                })
            });
        },
    },
};

export default papersTypesModule;
