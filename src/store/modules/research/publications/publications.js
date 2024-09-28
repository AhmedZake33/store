import Publication from '@/api/research/publications/publications';

const publication = new Publication();

const publicationModule = {

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
        SET_ITEMS: (state, publications) => {
            state.items = publications;
        },
        SET_TOTAL_ITEMS: (state, total) => {
            state.total = total;
        },
        SET_ITEMS_LOAD: (state, load) => {
            state.load = load;
        },
        SET_ITEM: (state, publication) => {
            state.item = publication;
        },
        SET_LOOKUPS(state, lookups) {
            state.lookups = lookups;
        },
    },
    actions: {
        publications({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                publication.list(payload.query)
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
                publication.add(payload.id, payload.query).then(response => {
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
                publication.get(id).then(response => {
                    commit('SET_ITEM', response.data);
                    commit('app/UPDATE_PAGE_DETAILS', response.data.name, {root: true});
                    commit('SET_ITEMS_LOAD', false);
                    resolve();
                })
            });
        },
        remove({commit}, id) {
            return new Promise((resolve, reject) => {
                publication.remove(id).then(response => {
                    resolve();
                })
            });
        },
        restore({commit}, id) {
            return new Promise((resolve, reject) => {
                publication.restore(id).then(response => {
                    resolve();
                })
            });
        },
        addMember({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                publication.addMember(payload.id, payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        reorderMembers({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                publication.reorderMembers(payload.query.first.id, payload.query.second.order)
                    .then(response => {
                        commit('app/UPDATE_LOAD', false, {root: true});
                        resolve();
                    })
                    .catch(error => {
                        commit('app/UPDATE_LOAD', false, {root: true});
                        reject(error);
                    });
            });
        },
        removeMember({commit}, id) {
            return new Promise((resolve, reject) => {
                publication.removeMember(id).then(response => {
                    resolve();
                })
            });
        },
        putFile({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                publication.putFile(payload.id, payload.data).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        syncPublications({commit}, payload) {
            commit('SET_ITEMS_LOAD', true);
            return new Promise((resolve, reject) => {
                publication.syncPublications(payload).then(response => {
                    commit('SET_ITEMS_LOAD', false);
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
    },
};

export default publicationModule;
