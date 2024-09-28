import Instructor from '../../../../api/user_settings/instructors/instructor';
import fileDownload from "js-file-download";

const instructor = new Instructor();

const instructorModule = {
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
        // status(state) {
        //     return state.item.removed;
        // },
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
        instructors({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('app/SET_GENERAL_LOAD', {link:'instructors',data:true},{root:true});
                instructor.list(payload.query)
                    .then(response => {
                        commit('SET_ITEMS', response.data);
                        commit('SET_TOTAL_ITEMS', response.meta.count);
                        commit('app/SET_GENERAL_TOTAL', {link:'instructors',data:response.meta.count},{root:true});
                        commit('app/SET_GENERAL_LOAD', {link:'instructors',data:false},{root:true});
                        resolve(response.data);
                    }).catch(error => {
                        commit('app/SET_GENERAL_LOAD', {link:'instructors',data:false},{root:true});
                        reject(error);
                    });
            });
        },
        reports({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                instructor.reports()
                    .then(response => {
                        commit('SET_ITEM', response.data);
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
            });
        },
        put({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                instructor.put(payload.id, payload.query).then(response => {
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
                instructor.get(id).then(response => {
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
                instructor.remove(id)
                    .then(response => {
                        resolve();
                    })
            });
        },
        restore({commit}, id) {
            return new Promise((resolve, reject) => {
                instructor.restore(id)
                    .then(response => {
                        resolve();
                    })
            });
        },

        export({commit}, payload) {
            return new Promise((resolve, reject) => {
                instructor.export(payload)
                    .then(response => {
                        fileDownload(response, payload.excel_name ? `${payload.excel_name}.xlsx` : 'instructors.xlsx');
                        resolve();
                    })
            });
        },

        removeDepartmentLink({commit}, payload) {
            return new Promise((resolve, reject) => {
                instructor.removeDepartmentLink(payload)
                    .then(response => {
                        resolve(response);
                    }).catch(error => {
                    reject(error)
                });
            });
        },

        exportMigrationTemplate({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                instructor
                    .exportMigrationTemplate()
                    .then(response => {
                        fileDownload(response, 'Instructors Migration Template.xlsx');
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

export default instructorModule;
