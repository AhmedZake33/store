import Settings from '../../../../api/administration/management/settings';
import fileDownload from 'js-file-download'

const settings = new Settings();

const settingModule = {
    namespaced: true,
    state: {
        item: null,
        items: [],
        total: 0,
        lookups: null,
        load: false,
        statusRequest:{}
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
        statusRequest(state) {
            return state.statusRequest;
        }
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
        SET_STATUS_REQUEST(state,statusRequest){
            state.statusRequest =statusRequest;
        }

    },
    actions: {
        
        settings({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                settings.list(payload.query).then(response => {
                    commit('SET_ITEMS', response.data);
                    commit('SET_TOTAL_ITEMS', response.meta.count);
                    commit('SET_ITEMS_LOAD', false);
                    commit('SET_LOOKUPS', response.meta.lookup);
                    resolve();
                });
            });
        },
        put({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                settings.put(payload.id, payload.query)
                    .then(response => {
                        commit('app/UPDATE_LOAD', false, {root: true});
                        resolve();
                    }).catch(error => {
                        commit('app/UPDATE_LOAD', false, {root: true});
                        reject(error);
                    });
            });
        },
        editSupplementarySubjects({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                settings.editSupplementarySubjects(payload.id, payload.query)
                    .then(response => {
                        commit('app/UPDATE_LOAD', false, {root: true});
                        resolve(response);
                    }).catch(error => {
                        commit('app/UPDATE_LOAD', false, {root: true});
                        reject(error);
                    });
            });
        },

        get({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                settings.get(payload)
                    .then(response => {
                        commit('SET_ITEM', response.data);
                        commit("SET_LOOKUPS",response.meta);
                        if ( response && response.data && typeof response.data == 'object') {
                            commit('app/UPDATE_PAGE_DETAILS', response.data, {root: true});
                          }
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    }).catch(error => {
                        reject(error);
                    });
            });
        },
        remove({commit}, id) {
            return new Promise((resolve, reject) => {
                settings.remove(id).then(response => {
                    resolve();
                });
            });
        },
        restore({commit}, id) {
            return new Promise((resolve, reject) => {
                settings.restore(id).then(response => {
                    resolve();
                });
            });
        },
        changeStatus({commit},payload){
            return new Promise((resolve, reject) => {
                settings.changeStatus(payload)
                    .then((response) => {
                        commit("SET_STATUS_REQUEST", response.success);
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        acceptDesire({commit},payload){
            return new Promise((resolve, reject) => {
                settings.acceptDesire(payload)
                    .then((response) => {
                        commit("SET_ITEMS", response.success);
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        enrollmentSetting({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                settings.enrollmentSetting(payload.id, payload.query)
                    .then(response => {
                        commit('app/UPDATE_LOAD', false, {root: true});
                        resolve();
                    }).catch(error => {
                        commit('app/UPDATE_LOAD', false, {root: true});
                        reject(error);
                    });
            });
        },



    },
};

export default settingModule;
