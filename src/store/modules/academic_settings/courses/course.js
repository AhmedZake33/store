import Course from '../../../../api/academic_settings/courses/course';
import fileDownload from 'js-file-download'
import router from "@/router";

const course = new Course();

const courseModule = {

    namespaced: true,
    state: {
        item: {},
        items: [],
        total: 0,
        lookups: null,
        load: false,
        coursesOutComes: null,
        universityRequirements: [],
        totalUniversityRequirements: 0,
        facultyRequirements: [],
        totalFacultyRequirements: 0,
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
        universityRequirements(state) {
            return state.universityRequirements;
        },
        totalUniversityRequirements(state) {
            return state.totalUniversityRequirements;
        },
        facultyRequirements(state) {
            return state.facultyRequirements;
        },
        totalFacultyRequirements(state) {
            return state.totalFacultyRequirements;
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
        SET_OUTCOMES(state, data) {
            state.coursesOutComes = data
        },
        SET_UNI_REQ_ITEMS(state, data) {
            state.universityRequirements = data
        },
        SET_TOTAL_UNI_REQ_ITEMS(state, data) {
            state.totalUniversityRequirements = data
        },
        SET_FACULTY_REQ_ITEMS(state, data) {
            state.facultyRequirements = data
        },
        SET_TOTAL_FACULTY_REQ_ITEMS(state, data) {
            state.totalFacultyRequirements = data
        },
    },
    actions: {
        courses({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('app/SET_GENERAL_LOAD', {link:'courses',data:true},{root:true});
                course.list(payload.query)
                    .then(response => {
                        commit('SET_ITEMS', response.data);
                        commit('SET_TOTAL_ITEMS', response.meta.count);
                        commit('app/SET_GENERAL_TOTAL', {link:'courses',data:response.meta.count},{root:true});
                        commit('app/SET_GENERAL_LOAD', {link:'courses',data:false},{root:true});
                        resolve();
                    }).catch(error => {
                        commit('app/SET_GENERAL_LOAD', {link:'courses',data:false},{root:true});
                        reject(error);
                    });
            });
        },
        universityRequirements({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('app/SET_GENERAL_LOAD', {link:'courses',data:true},{root:true});
                course.listUniversityFacultyRequirements(payload.id, payload.query)
                .then(response => {
                        commit('SET_UNI_REQ_ITEMS', response.data.university_requirements);
                        commit('SET_TOTAL_UNI_REQ_ITEMS', response.data.university_requirements.length-1);
                        commit('app/SET_GENERAL_TOTAL', {link:'courses',data:response.data.university_requirements.length-1},{root:true});
                        commit('app/SET_GENERAL_LOAD', {link:'courses',data:false},{root:true});
                        resolve();
                    }).catch(error => {
                        commit('app/SET_GENERAL_LOAD', {link:'courses',data:false},{root:true});
                        reject(error);
                    });
            });
        },
        facultyRequirements({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('app/SET_GENERAL_LOAD', {link:'courses',data:true},{root:true});
                course.listUniversityFacultyRequirements(payload.id, payload.query)
                    .then(response => {
                        commit('SET_FACULTY_REQ_ITEMS', response.data.faculty_requirements);
                        commit('SET_TOTAL_FACULTY_REQ_ITEMS', response.data.faculty_requirements.length-1);
                        commit('app/SET_GENERAL_TOTAL', {link:'courses',data:response.data.faculty_requirements.length-1},{root:true});
                        commit('app/SET_GENERAL_LOAD', {link:'courses',data:false},{root:true});
                        resolve();
                    }).catch(error => {
                        commit('app/SET_GENERAL_LOAD', {link:'courses',data:false},{root:true});
                        reject(error);
                    });
            });
        },
        exportSpecs({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                course.exportSpecs(payload)
                    .then(response => {
                        if (payload.type == "PDF") fileDownload(response, 'Courses specs.pdf');
                        if (payload.type == "word") fileDownload(response, 'Courses specs.docx');
                        // commit('SET_OUTCOMES', response.data);
                        // commit('SET_TOTAL_ITEMS', response.meta.count);
                        // commit('SET_LOOKUPS', response.meta.lookup);
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
            });
        },
        coursesOutComes({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                course.coursesOutComes(payload.query)
                    .then(response => {
                        commit('SET_OUTCOMES', response.data);
                        // commit('SET_TOTAL_ITEMS', response.meta.count);
                        // commit('SET_LOOKUPS', response.meta.lookup);
                        // commit('SET_ITEMS_LOAD', false);
                        resolve(response.data);
                    })
            });
        },
        coursesWorkspace({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                course.listWorkSpace(payload.query)
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
                course.put(payload.id, payload.query).then(response => {
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
                course.sync(payload.id, payload.query)
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
                course.get(payload).then(response => {
                    commit('SET_ITEM', response.data);
                    if (response && response.data && typeof response.data == 'object') {
                        commit('app/UPDATE_PAGE_DETAILS', {...response.data, print_code: true}, {root: true});
                    }
                    commit('SET_ITEMS_LOAD', false);
                    resolve(response);
                });
            });
        },
        remove({commit}, id) {
            return new Promise((resolve, reject) => {
                course.remove(id).then(response => {
                    resolve();
                })
            });
        },
        restore({commit}, id) {
            return new Promise((resolve, reject) => {
                course.restore(id).then(response => {
                    resolve();
                })
            });
        },

        export({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                course
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
        },

        exportUniversityRequirements({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                course
                    .exportUniversityRequirements(payload)
                    .then(response => {
                        fileDownload(response, payload.excel_name ? `${payload.excel_name}.xlsx` : 'University Requirements.xlsx');
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        exportFacultyRequirements({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                course
                    .exportFacultyRequirements(payload)
                    .then(response => {
                        fileDownload(response, payload.excel_name ? `${payload.excel_name}.xlsx` : 'Faculty Requirements.xlsx');
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        exportMigrationTemplate({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                course
                    .exportMigrationTemplate()
                    .then(response => {
                        fileDownload(response, 'Courses Migration Template.xlsx');
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

export default courseModule;
