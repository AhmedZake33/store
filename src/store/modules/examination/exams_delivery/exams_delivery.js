import ExamsDelivery from '@/api/examination/exams_delivery/exams_delivery';

const examsDelivery = new ExamsDelivery();

const examsDeliveryModule = {

    namespaced: true,
    state: {
        item: null,
        items: [],
        total: 0,
        lookups: null,
        exams: null,
        load: false,
        locations: null
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
        locations(state) {
            return state.locations;
        },
        exams(state) {
            return state.exams;
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
        SET_LOCATIONS(state, locations) {
            state.locations = locations;
        },
        SET_EXAMS(state, exams) {
            state.exams = exams;
        },
    },
    actions: {
        examsDelivery({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                examsDelivery.list(payload.id , payload.query)
                    .then(response => {
                        commit('SET_ITEMS', response.data);
                        commit('SET_TOTAL_ITEMS', response.meta.count);
                        commit('SET_LOOKUPS', response.meta.lookup);
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
            });
        },
        lookups({ commit },  query) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                examsDelivery.lookups(query.examId, query.query)
                    .then(response => {
                        commit('SET_LOOKUPS', response.meta.lookup);
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
            });
        },
        put({ commit }, payload) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                examsDelivery.put(payload.id, payload.query , payload.apiCallingParameter).then(response => {
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
                examsDelivery.get(id).then(response => {
                    commit('SET_ITEM', response.data);
                    if (response && response.data && typeof response.data == 'object') {
                        commit('app/UPDATE_PAGE_DETAILS', response.data, { root: true });
                    }
                    if(response && response.meta){
                        commit('SET_EXAMS', response.meta.lookup);
                    }
                    commit('SET_ITEMS_LOAD', false);
                    resolve();
                })
            });
        },
        remove({ commit }, id) {
            return new Promise((resolve, reject) => {
                examsDelivery.remove(id).then(response => {
                    resolve();
                })
            });
        },
        restore({ commit }, id) {
            return new Promise((resolve, reject) => {
                examsDelivery.restore(id).then(response => {
                    resolve();
                })
            });
        },
    },
};

export default examsDeliveryModule;
