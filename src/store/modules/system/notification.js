import Logs from '../../../api/system/notification'

const log = new Logs();
const logModule = {
    namespaced: true,
    state: {
        items: [],
        load: false,
        total: 0,
        item: {},
        actions: null,
        logLoad: false
    },
    getters: {
        items(state) {
            return state.items
        },
        log(state) {
            return state.item
            // return Object.entries(state.item).map(([key, value]) => {
            //     return {key, value}
            // }).filter(param => param.value !== 'null' && !param.key.includes('id')  && !param.key.includes('at') && !param.key.includes('value'));
        },
        logNewValue(state) {
            if (state.item.new_value !== "null" && state.item.new_value !== undefined) {
                return Object.entries(JSON.parse(state.item.new_value)).map(([key, value]) => {
                    return {key, value}
                }).filter(param => !param.key.includes('id') && param.value !== null && param.value !== '' && param.key !== 'system' && param.key !== 'latitude' && param.key !== 'longitude' && param.key !== 'created_by' && param.key !== 'search_text' && param.key !== 'removed');
            } else {
                return null;
            }
        },
        logOldValue(state) {
            if (state.item.old_value !== "null" && state.item.old_value !== undefined) {
                return Object.entries(JSON.parse(state.item.old_value)).map(([key, value]) => {
                    return {key, value}
                }).filter(param => !param.key.includes('id') && param.value !== null && param.value !== '' && param.key !== 'system' && param.key !== 'latitude' && param.key !== 'longitude' && param.key !== 'created_by' && param.key !== 'search_text' && param.key !== 'removed');
            } else {
                return null;
            }
        },
        logLoad(state) {
            return state.itemLoad
        },
        load(state) {
            return state.load;
        },
        total(state) {
            return state.total;
        }
    },
    mutations: {
        SET_ACTIONS(state, actions) {
            state.actions = actions
        },
        SET_TOTAL_LOGS(state, total) {
            state.total = total;
        },
        SET_LOGS(state, fields) {
            state.items = fields;
        },
        SET_LOGS_LOAD(state, load) {
            state.load = load;
        },
        SET_LOG_LOAD(state, load) {
            state.load = load;
        },
        SET_LOG(state, log) {
            state.item = log;
        }
    },
    actions: {
        fetchLogs(ctx, queryParams) {
            return new Promise((resolve, reject) => {
                log
                    .list(queryParams)
                    .then(response => resolve(response))
                    .catch(error => reject(error));
            });
        },
        getLogs({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_LOGS_LOAD', true);
                log.list(payload.query).then(response => {
                    commit('SET_LOGS', response.data);
                    commit('SET_ACTIONS', response.actions);
                    commit('SET_TOTAL_LOGS', response.meta.count);
                    commit('SET_LOGS_LOAD', false);
                    resolve();
                }).catch(error => {
                    reject(error);
                })
            })
        },
        getLog({commit}, id) {
            return new Promise((resolve, reject) => {
                commit('SET_LOG_LOAD', true);
                log.get(id).then(response => {
                    commit('SET_LOG', response);

                    // commit('SET_LOG', response.log);
                    commit('SET_LOG_LOAD', false);
                    resolve();
                }).catch(error => {
                    reject(error);
                })
            })
        }
    }
}

export default logModule;
