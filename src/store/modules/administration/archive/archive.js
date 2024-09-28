import Archive from '../../../../api/administration/archive/archive'
import fileDownload from "js-file-download";

const archive = new Archive()

const archiveModule = {
  namespaced: true,
  state: {
    files: [],
    selectedItem: [],
    archives: [],
    archiveLoad: false,
    contentLoad: false,
    totalArchive: 0,
    imageFolder: null,
    archive: null,
    loadingUpload: null,
    fullPath: [],
    parents: [],
    parentsBrowser: [],
    currentId: '',
    currentIdBrowser: '',
    totalBin: null,
    lookups: null,
    checkShortName: null,
    usersLoad: false,
    users: [],
    roles: [],
    currentIdEditor: null,
    editorParent: null,
    generalLoad: false,
  },
  getters: {
    selectedItem(state) {
      return state.selectedItem
    },
    contentLoad(state) {
      return state.contentLoad
    },
    archive(state) {
      return state.archive
    },
    archives(state) {
      return state.archives
    },
    lookups(state) {
      return state.lookups
    },
    archiveLoad(state) {
      return state.archiveLoad
    },
    totalArchive(state) {
      return state.totalArchive
    },
    parents(state) {
      return state.parents
    },
    parentsBrowser: state => state.parentsBrowser,

    currentId(state) {
      return state.currentId
    },
    users(state) {
      return state.users
    },
    roles(state) {
      return state.roles
    },
    loadingUpload(state) {
      return state.loadingUpload
    },
    usersLoad(state) {
      return state.usersLoad
    },
  },
  mutations: {
    SET_CONTENT_LOAD(state, load) {
      state.contentLoad = load
    },
    SET_ARCHIVES(state, archives) {
      state.archives = archives
    },
    SET_LOOKUPS(state, lookups) {
      state.lookups = lookups
    },
    SET_ARCHIVE_LOAD(state, load) {
      state.archiveLoad = load
    },
    SET_USERS(state, users) {
      state.users = users
    },
    SET_ROLES(state, roles) {
      state.roles = roles
    },
    SET_TOTAL_ARCHIVE(state, total) {
      state.totalArchive = total
    },
    SET_SELECTED_ITEM(state, item) {
      state.selectedItem.push(item)
    },
    REMOVE_SELECTED_ITEM(state, i) {
      state.selectedItem.splice(i, 1)
    },
    SET_RESET(state) {
      state.selectedItem = []
    },
    SET_ARCHIVE(state, archive) {
      state.archive = archive
    },
    SET_PARENTS(state, parents) {
      state.parents = parents
    },
    SET_CURRENT_ID(state, currentId) {
      state.currentId = currentId
    },

    SET_CHECK_SHORT_NAME(state, checkShortName) {
      state.checkShortName = checkShortName
    },
    SET_USERS_LOAD(state, load) {
      state.usersLoad = load
    },
    SET_LODGING_UPLOAD_IMG(state, loadingUpload) {
      state.loadingUpload = loadingUpload
    },
    SET_EDITOR_PARENT(state, editorParent) {
      state.editorParent = editorParent
    },
    SET_GENERAL_LOAD(state, generalLoad) {
      state.generalLoad = generalLoad
    }
  },
  actions: {
    archives({commit, getters}, payload = null) {
      return new Promise((resolve, reject) => {
        if (payload) {
          if (payload.load == false) {
            commit('SET_ARCHIVE_LOAD', payload.load)
          } else {
            commit('SET_ARCHIVE_LOAD', true)
          }
        }
        archive.list(payload ? payload.query : null, payload ? payload.id : null)
          .then(response => {
            commit('SET_ARCHIVES', response.data)
            commit('SET_LOOKUPS', response.meta.lookup)
            commit('SET_TOTAL_ARCHIVE', response.meta.count)
            commit('SET_ARCHIVE_LOAD', false)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getParents({commit}, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ARCHIVE_LOAD', true)
        archive
          .getParents(payload.id, payload.locale, payload.root_id ? payload.root_id : 0)
          .then(response => {
            commit('SET_PARENTS', response.parents)
            commit('SET_ARCHIVE_LOAD', false)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getParentsBrowser({commit}, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ARCHIVE_LOAD', true)
        archive
          .getParents(payload.id, payload.locale)
          .then(response => {
            commit('SET_PARENTS_BROWSER', response.parents)
            commit('SET_ARCHIVE_LOAD', false)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    upload({commit}, payload) {
      return new Promise((resolve, reject) => {
        commit('app/UPDATE_LOAD', true, {root: true});
        archive.upload(payload.resource, payload.id)
          .then(response => {
            commit('app/UPDATE_LOAD', false, {root: true});
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    update({commit}, payload) {
      return new Promise((resolve, reject) => {
        // commit('SET_ARCHIVE_LOAD', true);
        archive.update(payload.resource, payload.id)
          .then(response => {
            // commit('SET_ARCHIVE_LOAD', false);
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    import({commit}, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ARCHIVE_LOAD', true);
        archive.import(payload.resource, payload.id)
          .then(response => {
            commit('SET_ARCHIVE_LOAD', false);
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    order({commit}, payload) {
      return new Promise((resolve, reject) => {
        archive.order(payload)
          .then(response => {
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    add({commit}, payload) {
      return new Promise((resolve, reject) => {
        archive.add(payload.resource)
          .then(response => {
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    delete({commit}, payload) {
      commit('SET_GENERAL_LOAD', true)
      return new Promise((resolve, reject) => {
        archive.destroy(payload.id)
          .then(response => {
            commit('SET_GENERAL_LOAD', false)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    rename({commit}, payload) {
      return new Promise((resolve, reject) => {
        if (payload.resource) {
          archive.rename(payload)
            .then(response => {
              resolve()
            })
            .catch(error => {
              reject(error)
            })
        }
      })
    },
    move({commit}, payload) {
      return new Promise((resolve, reject) => {
        archive
          .move(payload)
          .then(response => {
            resolve()
          })
          .catch(error => {
            reject(error)
          })
        // });
      })
    },
    paste({commit}, payload) {
      return new Promise((resolve, reject) => {
        archive
          .paste(payload)
          .then(response => {
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    get({commit}, payload) {
      commit('SET_CONTENT_LOAD', true)
      return new Promise((resolve, reject) => {
        if (payload.id) {
          archive
            .content(payload.id, payload.query)
            .then(response => {
              commit('SET_CONTENT_LOAD', false)
              commit('SET_ARCHIVE', response.data)
              resolve()
            })
            .catch(error => {
              commit('SET_CONTENT_LOAD', false)
              reject(error)
            })
        }
      })
    },
    checkShortName({commit}, shortName) {
      return new Promise((resolve, reject) => {
        if (shortName) {
          archive
            .checkShortName(shortName)
            .then(response => {
              commit('SET_CHECK_SHORT_NAME', response)
              resolve()
            })
            .catch(error => {
              reject(error)
            })
        }
      })
    },
    setContent({commit}, payload) {
      return new Promise((resolve, reject) => {
        archive.setContent({
          body: payload.body,
          language: payload.language,
          id: payload.id
        })
          .then(response => {
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    usersRoles({commit}, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_USERS_LOAD', true)
        archive.usersRoles(payload.query)
          .then(response => {
            commit('SET_USERS', response.users)
            commit('SET_ROLES', response.roles)
            commit('SET_USERS_LOAD', false)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    exportFiles({commit}, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_CONTENT_LOAD', true);
        archive.exportFiles(payload)
          .then(response => {
            fileDownload(response, 'Archive.zip');
            commit('SET_CONTENT_LOAD', false);
            resolve(response);
          })
          .catch(error => {
            reject(error)
          })
      })
    },
  },
}

export default archiveModule
