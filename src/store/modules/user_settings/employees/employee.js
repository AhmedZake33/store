import Employee from '../../../../api/user_settings/employees/employee';
import fileDownload from "js-file-download";

const employee = new Employee();

const employeeModule = {
    namespaced: true,
    state: {
        item: null,
        items: [],
        total: 0,
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
        employees({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('app/SET_GENERAL_LOAD', {link:'employees',data:true},{root:true});
                employee.list(payload.query)
                    .then(response => {
                        commit('SET_ITEMS', response.data);
                        commit('SET_TOTAL_ITEMS', response.meta.count);
                        commit('app/SET_GENERAL_TOTAL', {link:'employees',data:response.meta.count},{root:true});
                        commit('app/SET_GENERAL_LOAD', {link:'employees',data:false},{root:true});
                        resolve(response.data);
                    }).catch(error => {
                        commit('app/SET_GENERAL_LOAD', {link:'employees',data:false},{root:true});
                        reject(error);
                    });
            });
        },
        put({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                employee.put(payload.id, payload.query).then(response => {
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
                employee.get(id).then(response => {
                    commit('SET_ITEM', response.data);
                    commit('app/UPDATE_PAGE_DETAILS', response.data.user, {root: true});
                    commit('SET_ITEMS_LOAD', false);
                    resolve();
                })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        remove({commit}, id) {
            return new Promise((resolve, reject) => {
                employee.remove(id)
                    .then(response => {
                        resolve();
                    })
            });
        },
        restore({commit}, id) {
            return new Promise((resolve, reject) => {
                employee.restore(id)
                    .then(response => {
                        resolve();
                    })
            });
        },
        export({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                employee.export(payload)
                    .then(response => {
                        fileDownload(response, 'Employees.xlsx');
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        exportMigrationTemplate({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                employee
                    .exportMigrationTemplate()
                    .then(response => {
                        fileDownload(response, 'Employees Migration Template.xlsx');
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

export default employeeModule;
