import Student from '../../../../api/student/students/student';
import fileDownload from 'js-file-download'

const student = new Student();

const studentModule = {
    namespaced: true,
    state: {
        item: {},
        dashboard: {},
        items: [],
        total: null,
        lookups: null,
        options: null,
        load: false,
        courses: [],
        student: null,
        isEditMode: false,
        editModePage: null,
        terms_grades:null,
    },
    getters: {
        items(state) {
            return state.items;
        },
        item(state) {
            return state.item;
        },
        dashboard(state) {
            return state.dashboard;
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
        courses(state) {
            return state.courses;
        },
        student(state) {
            return state.student
        },
        isEditMode(state) {
            return state.isEditMode
        },
        editPage(state) {
            return state.editModePage
        },
        options: state => state.options,
        terms_grades:state=>state.terms_grades
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
        SET_ITEM: (state, item) => {
            state.item = item
        },
        SET_DASHBOARD: (state, dashboard) => {
            state.dashboard = dashboard
        },
        SET_LOOKUPS(state, lookups) {
            state.lookups = lookups;
        },
        SET_OPTIONS(state, data) {
            state.options = data;
        },
        SET_COURSES(state, courses) {
            state.courses = courses;
        },
        SET_STUDENT(state, student) {
            state.student = student
        },
        SET_EDIT_MODE(state, status) {
            state.isEditMode = status
        },
        SET_EDIT_PAGE(state, page) {
            state.editModePage = page
        },
        SET_TERMS_GRADE(state,data){
            state.terms_grades = data
        }
    },
    actions: {
        dashboard({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                student.home(payload.id)
                    .then(response => {
                        commit('app/UPDATE_LOAD', false, {root: true});
                        commit('SET_DASHBOARD', response.data);
                        resolve();
                    })
                    .catch(error => {
                        commit('app/UPDATE_LOAD', false, {root: true});
                        reject(error);
                    });
            });
        },

        students({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('app/SET_GENERAL_LOAD', {link:'students',data:true},{root:true});
                student.list(payload.query).then(response => {
                    commit('SET_ITEMS', response.data);
                    commit('SET_TOTAL_ITEMS', response.meta.count);
                    commit('app/SET_GENERAL_TOTAL', {link:'students',data:response.meta.count},{root:true});
                    commit('app/SET_GENERAL_LOAD', {link:'students',data:false},{root:true});
                    resolve(response);
                }).catch(error => {
                    commit('app/SET_GENERAL_LOAD', {link:'students',data:false},{root:true});
                    reject(error);
                });
            });
        },
        put({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                student
                    .put(payload.id, payload.query, payload.details)
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
        get({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                student
                    .get(payload)
                    .then(response => {
                        commit('SET_ITEM', response.data);
                        if (response.data.student.data == null) {
                            response.data.student.data = {}
                        }
                        if(payload.type == 'terms_grades'){
                            // commit('SET_TERMS_GRADE', response.data.terms_grades);
                        }else{
                            commit('SET_STUDENT', response.data.student);
                        }
                        // commit("SET_LOOKUPS", response.meta);
                        commit('app/UPDATE_PAGE_DETAILS', response.data.student, {root: true});
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        getEdit({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                student
                    .getEdit(payload)
                    .then(response => {
                        commit('SET_ITEM', response.data);
                        commit("SET_LOOKUPS", response.meta.lookups);
                        let breadCrump = {
                            code: response.data.student.code,
                            name: response.data.name ? response.data.name : '',
                            name_local: response.data.name_local ? response.data.name_local : ''
                        }
                        commit('app/UPDATE_PAGE_DETAILS', breadCrump, {root: true});
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        remove({commit}, id) {
            return new Promise((resolve, reject) => {
                student.remove(id).then(response => {
                    resolve();
                });
            });
        },
        restore({commit}, id) {
            return new Promise((resolve, reject) => {
                student.restore(id).then(response => {
                    resolve();
                });
            });
        },
        lookup({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                student
                    .lookup(payload)
                    .then(response => {
                        commit("SET_LOOKUPS", response.success);
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        export({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                student.export(payload)
                    .then(response => {
                        fileDownload(response, 'Students.xlsx');
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
        search({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                student.search(payload.query).then(response => {
                    commit('SET_ITEMS', response.data);
                    commit('SET_ITEMS_LOAD', false);
                    resolve(response);
                });
            });
        },
        getCourses({commit}) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                student.studentCourses().then(response => {
                    commit('SET_COURSES', response.data);
                    commit('SET_ITEMS_LOAD', false);
                    resolve(response);
                });
            });
        },
        getCourseDetails({commit}, payload) {
            return new Promise((resolve, reject) => {
                student.show_my_course(payload.offering_id).then(response => {
                    resolve(response.data);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        updateEditMode({commit}, payload) {
            commit('SET_EDIT_MODE', payload.status);
            commit('SET_EDIT_PAGE', payload.edit_info);
        },
        updateNotes({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                student
                    .updateNotes(payload.id, payload.query)
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
        transcript({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true)
                student.transcript(payload)
                    .then(response => {
                        fileDownload(response, `Transcript.pdf`);
                        commit('SET_ITEMS_LOAD', false)
                        resolve(response)
                    }).catch(error => {
                        commit('app/UPDATE_LOAD', false, {root: true});
                        reject(error);
                      });
            })
        },
        MasterCertificate({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true)
                student.MasterCertificate(payload)
                    .then(response => {
                        fileDownload(response, `Mastertificate.pdf`);
                        commit('SET_ITEMS_LOAD', false)
                        resolve(response)
                    }).catch(error => {
                        commit('app/UPDATE_LOAD', false, {root: true});
                        reject(error);
                      });
            })
        },
        certificate({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true)
                student.certificate(payload)
                    .then(response => {
                        fileDownload(response, `certificate.pdf`);
                        commit('SET_ITEMS_LOAD', false)
                        resolve(response)
                    })
            })
        },
        exportMigrationTemplate({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                student
                    .exportMigrationTemplate()
                    .then(response => {
                        fileDownload(response, 'Students Migration Template.xlsx');
                        commit('SET_ITEMS_LOAD', false);
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
                student
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
                student
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

export default studentModule;
