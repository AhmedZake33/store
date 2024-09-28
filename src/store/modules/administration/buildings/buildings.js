import Building from '../../../../api/administration/buildings/buildings';
import fileDownload from "js-file-download";
const building = new Building();

const buildingModule = {

    namespaced: true,

    state: {
        items: [],
        item: null,
        total: 0,
        lookups: null,
        addlookups: null,
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
        lookups(state) {
            return state.lookups;
        },
        getAddLookups(state) {
            return state.addlookups;
        },
    },

    mutations: {
        SET_ITEMS: (state, items) => {
            state.items = items;
        },
        SET_ITEM: (state, item) => {
            state.item = item;
        },
        SET_ITEMS_LOAD: (state, load) => {
            state.load = load;
        },
        SET_TOTAL_ITEMS: (state, total) => {
            state.total = total;
        },
        SET_LOOKUPS: (state, load) => {
            state.lookups = load;
        },
        SET_ADD_LOOKUPS: (state, load) => {
            state.addlookups = load;
        },
    },

    actions: {
        buildings({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                building.list(payload.query)
                    .then(response => {
                        commit('SET_ITEMS', response.data);
                        commit('SET_TOTAL_ITEMS', response.meta.count);
                        commit('SET_ITEMS_LOAD', false);
                        commit('SET_LOOKUPS', response.meta.lookup);
                        resolve();
                    });
            });
        },
        put({commit}, payload) {
            commit('SET_ITEMS_LOAD', true);
            return new Promise((resolve, reject) => {
                building.put(payload.id, payload.query)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        commit('SET_ITEMS_LOAD', false);
                        reject(error);
                    });
            });
        },
        get({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                building.get(payload)
                    .then(response => {
                        commit('SET_ITEM', response.data);
                        commit('app/UPDATE_PAGE_DETAILS', response.data, {root: true});
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        remove({commit}, id) {
            return new Promise((resolve, reject) => {
                building.remove(id).then(response => {
                    resolve()
                })
            })
        },

        exportMigrationTemplate({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                building
                    .exportMigrationTemplate(payload)
                    .then(response => {
                        fileDownload(response, 'Halls.xlsx');
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
    }

}

export default buildingModule;
