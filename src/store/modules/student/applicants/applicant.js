import Applicant from '../../../../api/student/applicants/applicant';
import fileDownload from 'js-file-download'

const applicant = new Applicant();

const applicantModule = {
    namespaced: true,
    state: {
        item: null,
        items: [],
        total: 0,
        lookups: null,
        load: false,
        details: null,
        faculty_reports: [],
        statusRequest: {}
    },
    getters: {
        items(state) {
            return state.items;
        },
        faculty_reports(state) {
            return state.faculty_reports;
        },
        item(state) {
            return state.item;
        },
        details(state) {
            return state.details;
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
        statusRequest(state) {
            return state.statusRequest;
        }
    },
    mutations: {
        SET_ITEMS: (state, items) => {
            state.items = items;
        },

        SET_FACULTY_REPORTS: (state, items) => {
            state.faculty_reports = items;
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
        SET_DETAILS(state, details) {
            state.details = details;
        },
        SET_STATUS_REQUEST(state, statusRequest) {
            state.statusRequest = statusRequest;
        }

    },
    actions: {
        applicants({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                applicant.list(payload.payload).then(response => {

                    commit('SET_ITEMS', response.data);
                    commit('SET_TOTAL_ITEMS', response.meta.count);
                    commit('SET_DETAILS', response.meta.details);
                    commit('SET_ITEMS_LOAD', false);
                    commit('SET_LOOKUPS', response.meta.lookup);
                    resolve();
                });
            });
        },
        changeApplicantType({commit}, id){
            commit('SET_ITEMS_LOAD', true);
            return new Promise((resolve, reject) => {
                applicant.changeApplicantType(id)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    }).catch(error => {
                    commit('SET_ITEMS_LOAD', false);
                    reject(error);
                });
            });
        },
        reports({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                applicant.reports(payload).then(response => {
                    commit('SET_FACULTY_REPORTS', response.data);
                    commit('SET_ITEMS_LOAD', false);
                    commit('SET_LOOKUPS', response.meta)
                    resolve();
                });
            });
        },
        put({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                applicant.put(payload.id, payload.query)
                    .then(response => {
                        commit('app/UPDATE_LOAD', false, {root: true});
                        resolve();
                    }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        upload({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('app/UPDATE_LOAD', true, {root: true});
                applicant.upload(payload.resource)
                    .then(response => {
                        commit('app/UPDATE_LOAD', false, {root: true});
                        resolve()
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },

        get({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                applicant.get(payload)
                    .then(response => {
                        commit('SET_ITEM', response.data);
                        commit("SET_LOOKUPS", response.meta);
                        if (response.data && response.data.name) {
                            commit('app/UPDATE_PAGE_DETAILS', response.data, {root: true});
                        }
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    }).catch(error => {
                    reject(error);
                });
            });
        },
        remove({commit}, id) {
            return new Promise((resolve, reject) => {
                applicant.remove(id).then(response => {
                    resolve();
                });
            });
        },
        removeSubject({commit}, id) {
            return new Promise((resolve, reject) => {
                applicant.removeSubject(id).then(response => {
                    resolve();
                });
            });
        },
        restore({commit}, id) {
            return new Promise((resolve, reject) => {
                applicant.restore(id).then(response => {
                    resolve();
                });
            });
        },
        changeStatus({commit}, payload) {
            return new Promise((resolve, reject) => {
                applicant.changeStatus(payload)
                    .then((response) => {
                        commit("SET_STATUS_REQUEST", response.success);
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        assignProgram({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                applicant.assignProgram(payload)
                    .then((response) => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    }).catch((error) => {
                    reject(error);
                });
            });
        },

        bulkAssignProgram({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                applicant.bulkAssignProgram(payload)
                    .then((response) => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    }).catch((error) => {
                    reject(error);
                });
            });
        },

        bulk({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                applicant.bulk(payload)
                    .then((response) => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        bulkChangeStatus({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                applicant.bulkChangeStatus(payload)
                    .then((response) => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        acceptDesire({commit}, payload) {
            return new Promise((resolve, reject) => {
                applicant.acceptDesire(payload)
                    .then((response) => {
                        commit("SET_ITEMS", response.success);
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        changeDesire({commit}, payload) {
            return new Promise((resolve, reject) => {
                applicant.changeDesire(payload)
                    .then((response) => {
                        // commit("SET_ITEMS", response.success);
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        export({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                applicant.export(payload)
                    .then(response => {
                        fileDownload(response, 'applicants.xlsx');
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        lookups({commit}, payload) {
            return new Promise((resolve, reject) => {
                applicant.lookup(payload)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false);
                        commit('SET_LOOKUPS', response.success)
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        assignTags({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                applicant
                    .assignTags(payload.query)
                    .then(response => {
                        commit('app/UPDATE_LOAD', false, {root: true});
                        resolve(response);
                    })
                    .catch(error => {
                        commit('app/UPDATE_LOAD', false, {root: true});
                        reject(error);
                    });
            });
        },

        removeTags({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                applicant
                    .removeTags(payload.query)
                    .then(response => {
                        commit('app/UPDATE_LOAD', false, {root: true});
                        resolve(response);
                    })
                    .catch(error => {
                        commit('app/UPDATE_LOAD', false, {root: true});
                        reject(error);
                    });
            });
        },

    },
};

export default applicantModule;
