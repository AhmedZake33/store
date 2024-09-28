import Topics from '../../../../api/quality/coursespecs/topics';
import fileDownload from 'js-file-download'
import router from "@/router";

const topics = new Topics();

const topicsModule = {

    namespaced: true,
    state: {
        item: {},
        items: [],
        total: 0,
        lookups: null,
        load: false,
        coursesOutComes:null
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
        coursesOutComes: state => state.coursesOutComes,
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
        SET_OUTCOMES(state,data){
            state.coursesOutComes = data
        }
    },
    actions: {
        topics({commit},payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                topics.topics(payload)
                    .then(response => {
                        commit('SET_ITEMS', response.data);
                        commit('SET_TOTAL_ITEMS', response.meta.count);
                        commit('SET_LOOKUPS', response.meta.lookup);
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
            });
        },
        coursesWorkspace({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                topics.listWorkSpace(payload.query)
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
                topics.putTopics(payload.id,payload.query,payload.type).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    // router.push({ name: 'course', params: { id: response.data.id } })
                    resolve(response);
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        sync({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                topics.sync(payload.id, payload.query)
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
                topics.get(payload).then(response => {
                    commit('SET_ITEM', response.data);
                    if ( response && response.data && typeof response.data == 'object') {
                        commit('app/UPDATE_PAGE_DETAILS', {...response.data,print_code:true}, {root: true});
                      }
                    commit('SET_ITEMS_LOAD', false);
                    resolve(response);
                });
            });
        },
        remove({commit}, [id,type]) {
            return new Promise((resolve, reject) => {
                topics.removeTopics(id,type).then(response => {
                    resolve();
                })
            });
        },
        restore({commit}, id) {
            return new Promise((resolve, reject) => {
                topics.restore(id).then(response => {
                    resolve();
                })
            });
        },

        export({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                topics
                    .export(payload)
                    .then(response => {
                        fileDownload(response, payload.excel_name ? `${payload.excel_name}.xlsx` : 'Courses.xlsx');
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        }
    },
};

export default topicsModule;
