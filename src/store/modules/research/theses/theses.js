import Theses from '../../../../api/research/theses/theses';
import fileDownload from 'js-file-download'

const theses = new Theses();

const thesesModule = {

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
        SET_ITEMS: (state, theses) => {
            state.items = theses;
        },
        SET_TOTAL_ITEMS: (state, total) => {
            state.total = total;
        },
        SET_ITEMS_LOAD: (state, load) => {
            state.load = load;
        },
        SET_ITEM: (state, these) => {
            state.item = these;
        },
        SET_LOOKUPS(state, lookups) {
            state.lookups = lookups;
        },
    },
    actions: {
        theses({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                theses.list(payload.query)
                    .then(response => {
                        commit('SET_ITEMS', response.data);
                        commit('SET_TOTAL_ITEMS', response.meta.count);
                        commit('SET_LOOKUPS', response.meta.lookup);
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
            });
        },
        myTheses({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                theses.myTheses(payload.query)
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
                theses.put(payload.id, payload.query).then(response => {
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
                theses.get(id).then(response => {
                    commit('SET_ITEM', response.data);
                    commit('SET_LOOKUPS', response.meta.lookup);
                    commit('app/UPDATE_PAGE_DETAILS', response.data.name, {root: true});
                    commit('SET_ITEMS_LOAD', false);
                    resolve();
                })
            });
        },
        remove({commit}, id) {
            return new Promise((resolve, reject) => {
                theses.remove(id).then(response => {
                    resolve();
                })
            });
        },
        restore({commit}, id) {
            return new Promise((resolve, reject) => {
                theses.restore(id).then(response => {
                    resolve();
                })
            });
        },
        addMember({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                theses.addMember(payload.id, payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        reorderMembers({ commit }, payload) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                theses.reorderMembers(payload.query.first.id , payload.query.second.order)
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
        removeMember({commit}, id) {
            return new Promise((resolve, reject) => {
                theses.removeMember(id).then(response => {
                    resolve();
                })
            });
        },
        register({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                theses.register(payload).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        approve({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                theses.approve(payload.id, payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        discuss({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                theses.discuss(payload).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        change({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                theses.change(payload).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        undo({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                theses.undo(payload).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        printPdf({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                theses.printPdf(payload)
                .then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    fileDownload(response,'thesis.pdf');
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
    },
};

export default thesesModule;
