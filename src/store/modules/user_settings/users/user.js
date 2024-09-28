import {login, getMSLoginUrl, msLoginCallback, logout, Register} from '../../../../api/system/auth'; // getInfo
import User from '../../../../api/user_settings/users/user';
import { Auth, removeAuth, deleteToken, removeToken, resetPermission, setLogged, setToken } from '../../../../utils/auth';
import fileDownload from "js-file-download";
import router from "@/router";

const user = new User();

const userModule = {
  namespaced: true,
  state: {
    auth: null,
    item: null,
    items: [],
    lookups: [],
    total: 0,
    load: false,
    userAccess:[],
    photoData:null
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
    userAccess(state){
      return state.userAccess;
    }
  },
  mutations: {
    SET_AUTH: (state, user) => {
      state.auth = user;
    },
    SET_USERS: (state, users) => {
      state.items = users;
    },
    SET_TOTAL_USERS: (state, total) => {
      state.total = total;
    },
    SET_USERS_LOAD: (state, load) => {
      state.load = load;
    },
    SET_USER: (state, user) => {
      state.item = user;
    },
    SET_LOOKUPS(state, lookups) {
      state.lookups = lookups;
    },
    SET_USER_ACCESS(state,userAccess){
      state.userAccess=userAccess;
    },
    SET_PHOTO(state,data){
      state.photoData = data
    },
  },
  actions: {
    login({ commit, dispatch }, userInfo) {
      commit('app/SET_GENERAL_LOAD', {link:'login',data:true},{root:true});
      const { email, password } = userInfo;
      return new Promise((resolve, reject) => {
        login({ email: email.trim(), password: password })
          .then(response => {
            setLogged('1');
            setToken(response.data.token);
            delete response.data.instructor_data
            Auth(response.data);
            resolve();
          })
          .catch(error => {
            commit('app/SET_GENERAL_LOAD', {link:'login',data:false},{root:true});
            if (error.response.status == 503) {
              router.push({name: 'misc-under-maintenance'})
            }
            reject(error);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            setLogged('0');
            removeToken();
            deleteToken();
            removeAuth();
            resetPermission();
            resolve();
          })
          .catch(error => {
            setLogged('0');
            removeToken();
            deleteToken();
            removeAuth();
            resetPermission();
            reject(error);
          });
      });
    },
    users({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_USERS_LOAD', true);
        user.list(payload.query).then(response => {
          commit('SET_USERS', response.data);
          commit('SET_TOTAL_USERS', response.meta.count);
          commit('SET_USERS_LOAD', false);
          commit('SET_LOOKUPS', response.meta.lookup);
          resolve();
        });
      });
    },
    put({ commit }, payload) {
      commit('app/UPDATE_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        user
          .put(payload.id, payload.query)
          .then(response => {
            commit('app/UPDATE_LOAD', false, { root: true });
            resolve(response);
          })
          .catch(error => {
            commit('app/UPDATE_LOAD', false, { root: true });
            reject(error);
          });
      });
    },
    setAccessControl({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_USERS_LOAD', true);
        user
          .setAccessControl(payload)
          .then(response => {
            commit('SET_USERS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    uploadPhoto({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_USERS_LOAD', true);
        user
          .setPhoto(payload)
          .then(response => {
            commit('SET_PHOTO', response.data);
            commit('SET_USERS_LOAD', false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    get({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_USERS_LOAD', true);
        user.getData(id)
          .then(response => {
            commit('SET_USER', response.data);
            if ( response && response.data && typeof response.data == 'object') {
              commit('app/UPDATE_PAGE_DETAILS', response.data, {root: true});
            }
            commit('SET_USERS_LOAD', false);
            resolve(response.data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    remove({ commit }, id) {
      return new Promise((resolve, reject) => {
        user
          .remove(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    restore({ commit }, id) {
      return new Promise((resolve, reject) => {
        user
          .restore(id)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    accessUser({ commit }, payload) {
      return new Promise((resolve, reject) => {
        user
          .addAccessUser(payload)
          .then(response => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getUserAccess({commit},id) {
      commit('SET_USERS_LOAD', true);
      return new Promise((resolve, reject) => {
        user
          .getAccessUser(id)
          .then(response => {
            commit('SET_USER_ACCESS', response.data);

            resolve(response);
          })
          .catch(error => {

            reject(error);

          });
      });
    },
    resetUserAccess({commit},id) {
      return new Promise((resolve, reject) => {
        user
          .resetAccessUser(id)
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    profile({commit}) {
      return new Promise((resolve, reject) => {
        user.profile()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    export({commit}, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_USERS_LOAD', true);
        user.export(payload)
            .then(response => {
              fileDownload(response, 'Users.xlsx');
              commit('SET_USERS_LOAD', false);
              resolve();
            })
            .catch(error => {
              reject(error);
            });
      });
    },
    getMSLoginUrl({ commit, dispatch }, userInfo) {
      commit('app/UPDATE_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        getMSLoginUrl()
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            commit('app/UPDATE_LOAD', false, { root: true });
            reject(error);
          });
      });
    },
    msLoginCallback({ commit, dispatch }, payload) {
      commit('app/UPDATE_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        msLoginCallback(payload)
          .then(response => {
            setLogged('1');
            setToken(response.data.token);
            delete response.data.instructor_data
            Auth(response.data);
            resolve();
          })
          .catch(error => {
            commit('app/UPDATE_LOAD', false, { root: true });
            reject(error);
          });
      });
    },
  },
};

export default userModule;
