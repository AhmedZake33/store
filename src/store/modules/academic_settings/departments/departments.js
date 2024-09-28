import Department from '../../../../api/academic_settings/departments/departments';
import fileDownload from 'js-file-download'
import router from "@/router";

const department = new Department();

const departmentModule = {

    namespaced: true,
    state: {
        item: {},
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
        departments({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('app/SET_GENERAL_LOAD', {link:'departments',data:true},{root:true});
                department.list(payload.query)
                    .then(response => {
                        commit('SET_ITEMS', response.data);
                        commit('SET_TOTAL_ITEMS', response.meta.count);
                        commit('app/SET_GENERAL_TOTAL', {link:'departments',data:response.meta.count},{root:true});
                        commit('app/SET_GENERAL_LOAD', {link:'departments',data:false},{root:true});
                        resolve(response);
                    }).catch(error => {
                        commit('app/SET_GENERAL_LOAD', {link:'departments',data:false},{root:true});
                        reject(error);
                    });
            });
        },
        put({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                department.put(payload.id, payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    // router.push({ name: 'department', params: { id: response.data.id } })
                    commit('SET_ITEMS_LOAD', false);
                    resolve(response);
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        get({commit}, id) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                department.get(id).then(response => {
                    commit('SET_ITEM', response.data);
                    if ( response && response.data && typeof response.data == 'object') {
                        commit('app/UPDATE_PAGE_DETAILS', response.data, {root: true});
                      }
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
                department.remove(id)
                    .then(response => {
                        resolve();
                    })
            });
        },
        restore({commit}, id) {
            return new Promise((resolve, reject) => {
                department.restore(id)
                    .then(response => {
                        resolve();
                    })
            });
        },
        export({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                department.export(payload)
                    .then(response => {
                        fileDownload(response, payload.excel_name ? `${payload.excel_name}.xlsx` : 'departments.xlsx');
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        exportMigrationTemplate({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                department
                    .exportMigrationTemplate()
                    .then(response => {
                        fileDownload(response, 'Departments Migration Template.xlsx');
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

export default departmentModule;
