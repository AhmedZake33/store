import Program from '../../../../api/academic_settings/programs/program';
import fileDownload from 'js-file-download'
import router from "@/router";

const program = new Program();

const programModule = {
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
        programs({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('app/SET_GENERAL_LOAD', {link:'programs',data:true},{root:true});
                program.list(payload.query).then(response => {
                    commit('SET_ITEMS', response.data);
                    commit('SET_TOTAL_ITEMS', response.meta.count);
                    commit('app/SET_GENERAL_TOTAL', {link:'programs',data:response.meta.count},{root:true});
                    commit('app/SET_GENERAL_LOAD', {link:'programs',data:false},{root:true});
                    resolve();
                }).catch(error => {
                    commit('app/SET_GENERAL_LOAD', {link:'programs',data:false},{root:true});
                    reject(error);
                });
            });
        },
        saveResearchPlan({ commit }, payload){
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                program.saveResearchPlan(payload).then(response => {
                    commit('SET_ITEMS_LOAD', false);
                    resolve();
                }).catch((error)=> {
                    reject(error);
                    commit('SET_ITEMS_LOAD', false);
                });
            });
        },
        setGeneral({ commit }, payload){
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                program.setGeneral(payload.id).then(() => {
                    commit('SET_ITEMS_LOAD', false);
                    resolve();
                }).catch((error)=> {
                    reject(error);
                });
            });
        },
        put({ commit }, payload) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                program.put(payload.id, payload.query)
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

        sync({ commit }, payload) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                program.sync(payload.id, payload.query)
                    .then(response => {
                        commit('app/UPDATE_LOAD', false, { root: true });
                        resolve(response);
                    }).catch(error => {
                        commit('app/UPDATE_LOAD', false, { root: true });
                        reject(error);
                    });
            });
        },

        save_pool({ commit }, payload) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                program.save_pool(payload.id, payload.query)
                    .then(response => {
                        commit('app/UPDATE_LOAD', false, { root: true });
                        resolve(response);
                    }).catch(error => {
                        commit('app/UPDATE_LOAD', false, { root: true });
                        reject(error);
                    });
            });
        },
        delete_pool({ commit }, payload) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                program.delete_pool(payload.id)
                    .then(response => {
                        commit('app/UPDATE_LOAD', false, { root: true });
                        resolve(response);
                    }).catch(error => {
                        commit('app/UPDATE_LOAD', false, { root: true });
                        reject(error);
                    });
            });
        },

        update({ commit }, payload) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                program.update(payload.id, payload.query)
                    .then(response => {
                        commit('app/UPDATE_LOAD', false, { root: true });
                        resolve(response);
                    }).catch(error => {
                        commit('app/UPDATE_LOAD', false, { root: true });
                        reject(error);
                    });
            });
        },

        delete({ commit }, id) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                program.delete(id)
                    .then(response => {
                        commit('app/UPDATE_LOAD', false, { root: true });
                        resolve(response);
                    }).catch(error => {
                        commit('app/UPDATE_LOAD', false, { root: true });
                        reject(error);
                    });
            });
        },

        deletePorgramCourse({ commit }, id) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                program.deletePorgramCourse(id)
                    .then(response => {
                        commit('app/UPDATE_LOAD', false, { root: true });
                        resolve(response);
                    }).catch(error => {
                        commit('app/UPDATE_LOAD', false, { root: true });
                        reject(error);
                    });
            });
        },

        get({ commit }, id) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                program.get(id).then(response => {
                    commit('SET_ITEM', response.data);
                    if (response && response.data && typeof response.data == 'object') {
                        commit('app/UPDATE_PAGE_DETAILS', response.data, { root: true });
                    }

                    commit('SET_ITEMS_LOAD', false);
                    resolve(response);
                });
            });
        },
        getStudyPlan({ commit }, payload) {
            return new Promise((resolve, reject) => {
                program.getStudyPlan(payload).then(response => {
                resolve(response.data);
              }).catch(error => {
                reject(error.response.data.errors[0]);
              });
            });
          },
        remove({ commit }, id) {
            return new Promise((resolve, reject) => {
                program.remove(id).then(response => {
                    resolve();
                });
            });
        },
        restore({ commit }, id) {
            return new Promise((resolve, reject) => {
                program.restore(id).then(response => {
                    resolve();
                });
            });
        },
        export({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                program.export(payload)
                    .then(response => {
                        fileDownload(response, payload.excel_name ? `${payload.excel_name}.xlsx` : 'programs.xlsx');
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        saveProgramPrerequisiteCourses({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                program.saveProgramPrerequisiteCourses(payload).then(response => {
                    commit('SET_ITEMS_LOAD', false);
                    resolve(response);
                });
            });
        },
        updateCourseSemester({ commit }, payload) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                program.updateCourseSemester(payload.id, payload.query)
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
        updateRequirements({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                program.updateRequirements(payload.program_id, payload.type , payload.id , payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    // router.push({ name: 'course', params: { id: response.data.id } })
                    resolve(response);
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
    },
};

export default programModule;
