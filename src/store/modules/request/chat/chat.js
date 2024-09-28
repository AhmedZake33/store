import Chat from '../../../../api/resquests/chat/chat'

const chat = new Chat();
const chatModule = {
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
        item(state) {
            return state.item
        },

        load(state) {
            return state.load;
        },
        total(state) {
            return state.total;
        }
    },
    mutations: {

        SET_TOTAL(state, total) {
            state.total = total;
        },
        SET_ITEMS(state, items) {
            state.items = items;
        },
        SET_LOAD(state, load) {
            state.load = load;
        },
        SET_ITEM(state, item) {
            state.item = item;
        }
    },
    actions: {
        items({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_LOAD', true);
                chat.list(payload.query)
                    .then(response => {
                        commit('SET_ITEMS', response.data);
                        commit('SET_TOTAL', response.meta.count);
                        commit('SET_LOAD', false);
                        resolve(response);
                    }).catch(error => reject(error));
            });
        },

        messages({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_LOAD', true);
                chat.messages(payload).then(response => {
                    commit('SET_ITEMS', response.data);
                    commit('SET_TOTAL', response.meta.count);
                    commit('SET_LOAD', false);
                    resolve();
                }).catch(error => {
                    reject(error);
                })
            })
        },

        message({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_LOAD', true);
                chat.message(payload.id, payload.resource).then(response => {
                    commit('SET_LOAD', false);
                    resolve();
                }).catch(error => {
                    reject(error);
                })
            })
        }
    }
}

export default chatModule;
