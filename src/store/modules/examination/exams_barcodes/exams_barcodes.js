import ExamBarcode from '@/api/examination/exams_barcodes/exams_barcodes';
import fileDownload from "js-file-download";

const examBarcode = new ExamBarcode();

const examsBarcodesModule = {

    namespaced: true,
    state: {
        item: null,
        items: [],
        total: 0,
        lookups: null,
        students: [],
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
        students(state) {
            return state.students;
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
        SET_ITEM: (state, data) => {
            state.item = data;
        },
        SET_LOOKUPS(state, lookups) {
            state.lookups = lookups;
        },
        SET_STUDENTS(state, students) {
            state.students = students;
        },
    },
    actions: {
        examsBarcodes({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                examBarcode.list(payload.query)
                    .then(response => {
                        commit('SET_ITEMS', response.data);
                        commit('SET_TOTAL_ITEMS', response.meta.count);
                        commit('SET_LOOKUPS', response.meta.lookup);
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
            });
        },

        generateBackupBarcodes({ commit }, payload) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                examBarcode.generateBackupBarcodes(payload).then(response => {
                    commit('app/UPDATE_LOAD', false, { root: true });
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, { root: true });
                    reject(error);
                });
            });
        },

        searchForStudent({ commit }, payload) {
            // commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                examBarcode.searchForStudent(payload).then(response => {
                    // commit('app/UPDATE_LOAD', false, { root: true });
                    commit('SET_STUDENTS', response.data);
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, { root: true });
                    reject(error);
                });
            });
        },

        attachBackupBarcodeToStudent({ commit }, payload) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                examBarcode.attachBackupBarcodeToStudent(payload).then(response => {
                    commit('app/UPDATE_LOAD', false, { root: true });
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, { root: true });
                    reject(error);
                });
            });
        },
        
        detachBackupBarcodeToStudent({ commit }, barcode) {
            commit('app/UPDATE_LOAD', true, { root: true });
            return new Promise((resolve, reject) => {
                examBarcode.detachBackupBarcodeToStudent(barcode).then(response => {
                    commit('app/UPDATE_LOAD', false, { root: true });
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, { root: true });
                    reject(error);
                });
            });
        },

        exportBarcodes({commit}, payload) {
            return new Promise((resolve, reject) => {
                examBarcode.exportBarcodes(payload)
                    .then(response => {
                        fileDownload(response, 'Barcodes.xlsx');
                        resolve();
                    })
            });
        },

        exportBackupBarcodes({commit}) {
            return new Promise((resolve, reject) => {
                examBarcode.exportBackupBarcodes()
                    .then(response => {
                        fileDownload(response, 'Backup Barcodes.xlsx');
                        resolve();
                    })
            });
        },

        // get({ commit }, id) {
        //     return new Promise((resolve, reject) => {
        //         commit('SET_ITEMS_LOAD', true);
        //         examBarcode.get(id).then(response => {
        //             commit('SET_ITEM', response.data);
        //             if (response && response.data && typeof response.data == 'object') {
        //                 commit('app/UPDATE_PAGE_DETAILS', response.data, { root: true });
        //             }
        //             commit('SET_ITEMS_LOAD', false);
        //             resolve();
        //         })
        //     });
        // },
        // remove({ commit }, id) {
        //     return new Promise((resolve, reject) => {
        //         examBarcode.remove(id).then(response => {
        //             resolve();
        //         })
        //     });
        // },
        // restore({ commit }, id) {
        //     return new Promise((resolve, reject) => {
        //         examBarcode.restore(id).then(response => {
        //             resolve();
        //         })
        //     });
        // },
    },
};

export default examsBarcodesModule;
