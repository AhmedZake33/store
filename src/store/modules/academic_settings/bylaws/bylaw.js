import Bylaw from '../../../../api/academic_settings/bylaws/bylaw';
import fileDownload from 'js-file-download'
import router from "@/router";

const bylaw = new Bylaw();

const bylawModule = {
    namespaced: true,
    state: {
        item: {},
        items: [],
        total: 0,
        lookups: null,
        load: false,
        currentId: '',
        gradesVisibility:{}
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
        currentId(state) {
            return state.currentId
        },
        gradesVisibility(state) {
            return state.gradesVisibility
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
        SET_CURRENT_ID(state, currentId) {
            state.currentId = currentId
        },
        SET_GRADES_VISIBILITY(state, gradesVisibility) {
            state.gradesVisibility = gradesVisibility
        },
    },
    actions: {
        bylaws({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('app/SET_GENERAL_LOAD', {link:'bylaws',data:true},{root:true});
                bylaw.list(payload.query).then(response => {
                    commit('SET_ITEMS', response.data);
                    commit('SET_TOTAL_ITEMS', response?.meta?.count);
                    commit('app/SET_GENERAL_TOTAL', {link:'bylaws',data:response?.meta?.count},{root:true});
                    commit('app/SET_GENERAL_LOAD', {link:'bylaws',data:false},{root:true});
                    resolve(response);
                }).catch(error => {
                    commit('app/SET_GENERAL_LOAD', {link:'bylaws',data:false},{root:true});
                    reject(error);
                });
            });
        },
        put({ commit }, payload) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                bylaw
                    .put(payload.id, payload.query)
                    .then(response => {
                        commit('app/UPDATE_LOAD', false, { root: true });
                        // router.push({ name: 'bylaw', params: { id: response.data.id } })
                        resolve(response);
                    })
                    .catch(error => {
                        commit('app/UPDATE_LOAD', false, { root: true });
                        reject(error);
                    });
            });
        },

        specialization({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                bylaw.specialization(payload).then(response => {
                    commit('SET_ITEMS', response.data);
                    commit('SET_TOTAL_ITEMS', response.meta.count);
                    commit('SET_LOOKUPS', response.meta.lookup);
                    commit('SET_ITEMS_LOAD', false);
                    resolve(response);
                });
            });
        },
        gradesVisibility({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                bylaw
                .gradesVisibility(payload.id, payload.query)
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
        setSettings({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                bylaw.setSettings(payload)
                .then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                        // router.push({ name: 'bylaw', params: { id: response.data.id } })
                        resolve(response);
                    })
                    .catch(error => {
                        commit('app/UPDATE_LOAD', false, { root: true });
                        reject(error);
                    });
                });
        },
        changeStatus({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                bylaw.changeStatus(payload)
                .then(response => {
                    commit('SET_ITEMS_LOAD', false);
                    resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                });
            },
        get({commit}, id) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                bylaw.get(id)
                    .then(response => {
                        commit('SET_GRADES_VISIBILITY', response.meta)
                        commit('SET_ITEM', response.data);
                        if (response && response.data && typeof response.data == 'object') {
                            commit('app/UPDATE_PAGE_DETAILS', response.data, { root: true });
                        }
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                });
            },
            editGrades({commit}, payload) {
                return new Promise((resolve, reject) => {
                    commit('SET_ITEMS_LOAD', true);
                    bylaw
                    .editGrades(payload)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        setSuccessGrades({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                bylaw.setSuccessGrades(payload)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
            });
        },

        save_level({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                bylaw.save_level(payload)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
            });
        },

        syncRequirement({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                bylaw.syncRequirement(payload)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
            });
        },


        delete_level({ commit }, id) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                bylaw.delete_level(id)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
            });
        },

        delete_specialization({ commit }, id) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                bylaw.delete_specialization(id)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
            });
        },

        saveSemesterGrades({ commit }, id) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                bylaw.saveSemesterGrades(id)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
            });
        },

        removeSuccessGrades({ commit }, id) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                bylaw.removeSuccessGrades(id)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
            });
        },

        editGradesRange({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                bylaw.editGradesRange(payload)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        removeGradesRange({ commit }, id) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                bylaw.removeRangeGrades(id)
                    .then(response => {
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
            });
        },
        removeGrade({ commit }, id) {
            return new Promise((resolve, reject) => {
                bylaw.removeGrade(id).then(response => {
                    resolve();
                });
            });
        },
        remove({ commit }, id) {
            return new Promise((resolve, reject) => {
                bylaw.remove(id).then(response => {
                    resolve();
                });
            });
        },
        restore({ commit }, id) {
            return new Promise((resolve, reject) => {
                bylaw.restore(id).then(response => {
                    resolve();
                });
            });
        },
        export({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                bylaw
                    .export(payload)
                    .then(response => {
                        fileDownload(response, payload.excel_name ? `${payload.excel_name}.xlsx` : 'bylaws.xlsx');
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        exportpdf({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                bylaw.exportpdf(payload).then(response => {
                    fileDownload(response, `${payload.name}.pdf`);
                    commit('SET_ITEMS_LOAD', false);
                    resolve(response);
                })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        programsTree({ commit }, bylaw_id) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                bylaw.programsTree(bylaw_id).then(response => {
                    commit('SET_ITEMS_LOAD', false);
                    resolve(response);
                });
            });
        },
        saveProgramsTree({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                bylaw.saveProgramsTree(payload).then(response => {
                    commit('SET_ITEMS_LOAD', false);
                    resolve(response);
                });
            });
        },

        addSpecialization({ commit }, query) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                bylaw
                    .addSpecialization(query.id,query.payload)
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
       updateSpecialization({ commit }, query,id) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                bylaw
                    .updateSpecialization(query,id)
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


        exportDataExcel({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                bylaw.exportDataExcel(payload.query)
                    .then(response => {
                        fileDownload(response, 'bylaws.xlsx');
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        }
    },
};

export default bylawModule;
