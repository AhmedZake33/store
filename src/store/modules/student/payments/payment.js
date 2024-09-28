import Payment from '@/api/student/payments/payment';
import fileDownload from 'js-file-download'

const payment = new Payment();

const paymentModule = {

    namespaced: true,
    state: {
        item: null,
        items: null,
        total: 0,
        lookups: null,
        details: null,
        load: false,
        paymentsData: null,
        archive_id: null,
        success: null,
        batches:[],
        batch: null,
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
        details(state) {
            return state.details;
        },
        paymentsData(state) {
            return state.paymentsData;
        },
        archive_id(state) {
            return state.archive_id;
        },
        success(state) {
            return state.success;
        },
        batches(state) {
            return state.batches;
        },
        batch(state) {
            return state.batch;
        },
    },
    mutations: {
        SET_ITEMS: (state, data) => {
            state.items = data;
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
        SET_DETAILS(state, details) {
            state.details = details;
        },
        SET_PAYMENTS_DATA(state, paymentsData) {
            state.paymentsData = paymentsData;
        },
        SET_ARCHIVE_ID(state, archive_id) {
            state.archive_id = archive_id;
        },
        SET_SUCCESS(state, success) {
            state.success = success;
        },
        SET_BATCHES(state, batches) {
            state.batches = batches;
        },
        SET_BATCH_ITEM(state, batch) {
            state.batch = batch;
        },
    },
    actions: {
        payments({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('app/SET_GENERAL_LOAD', {link:'payments',data:true},{root:true});
                payment.list(payload.query)
                    .then(response => {
                        commit('SET_ITEMS', response.data);
                        commit('SET_TOTAL_ITEMS', response?.meta?.count);
                        commit('app/SET_GENERAL_TOTAL', {link:'payments',data:response?.meta?.count},{root:true});
                        commit('app/SET_GENERAL_LOAD', {link:'payments',data:false},{root:true});
                        commit('SET_DETAILS', response.meta.details);
                        resolve();
                    }).catch(error => {
                        reject(error);
                    });
            });
        },
        createPayment({commit}, payload) {      
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                payment.createPayment(payload.id, payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        batches({commit}, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                payment.batches()
                    .then(response => {
                        commit('SET_BATCHES', response.data);
                        commit('SET_TOTAL_ITEMS', response.meta.count);
                        commit('SET_DETAILS', response.meta.details);
                        commit('SET_LOOKUPS', response.meta.lookup);
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
            });
        },
        directCashback({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                payment.directCashback(payload.id, payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        scholarship({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                payment.scholarship(payload.id, payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        getBatch({commit}, id) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                payment.getBatch(id)
                    .then(response => {
                        commit('SET_BATCH_ITEM', response.paymentsData);
                        commit('SET_ITEMS_LOAD', false);
                        resolve();
                    })
            });
        },
        put({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                payment.put(payload.id, payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        refund({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                payment.refund(payload.query, payload.id).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        putTransaction({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                payment.putTransaction(payload.id, payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        get({commit}, id) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                payment.get(id).then(response => {
                    commit('SET_ITEM', response.data);
                    commit('SET_ITEMS_LOAD', false);
                    resolve();
                })
            });
        },
        remove({commit}, id) {
            return new Promise((resolve, reject) => {
                payment.remove(id).then(response => {
                    resolve();
                })
            });
        },
        restore({commit}, id) {
            return new Promise((resolve, reject) => {
                payment.restore(id).then(response => {
                    resolve();
                })
            });
        },
        history({commit},payload){
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                payment.history(payload)
                  .then(response => {
                      commit('SET_ITEMS', response.data);
                      commit('SET_TOTAL_ITEMS', response.meta.count);
                      commit('SET_DETAILS', response.meta.details);
                      commit('SET_LOOKUPS', response.meta.lookup);
                      commit('SET_ITEMS_LOAD', false);
                      resolve();
                  })
            });
        },
        editDueDate({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                payment.editDueDate(payload.id, payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        createInstallments({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                payment.createInstallments(payload.payment_id, payload.id ,payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        createPaymentOrder({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                payment.createPaymentOrder(payload.payment_id,payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    
                    resolve(response);
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        removeInstallment({commit}, id) {
            return new Promise((resolve, reject) => {
                payment.removeInstallment(id).then(response => {
                    resolve();
                })
            });
        },
        importPayments({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                payment.importPayments(payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    commit('SET_PAYMENTS_DATA', response.paymentsData);
                    commit('SET_ARCHIVE_ID', response.archive_id);
                    commit('SET_SUCCESS', response.success);
                    resolve(response);
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        submitFile({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                payment.submitFile(payload.id).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve(response);
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        deleteBatch({commit}, payload) {
            return new Promise((resolve, reject) => {
                payment.deleteBatch(payload.id).then(response => {
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        exportPaymentInvoice({commit}, payload) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                payment.exportPaymentInvoice(payload)
                .then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    fileDownload(response,'Invoice.pdf');
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        checkPayment({commit}, id) {
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                payment.checkPayment(id).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve(response);
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
        exportData({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                payment.exportData(payload.query)
                    .then(response => {
                        fileDownload(response, 'Invoices.pdf')
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },
        exportDataExcel({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                payment.exportDataExcel(payload.query)
                    .then(response => {
                        fileDownload(response, 'Invoices.xlsx')
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },
        invoicesReport({ commit }, payload) {
            return new Promise((resolve, reject) => {
                commit('SET_ITEMS_LOAD', true);
                payment.invoicesReport(payload.query)
                    .then(response => {
                        fileDownload(response, 'Invoices Report.pdf')
                        commit('SET_ITEMS_LOAD', false);
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },

        submitScholarshipForm({commit}, payload) {      
            commit('app/UPDATE_LOAD', true, {root: true});
            return new Promise((resolve, reject) => {
                payment.submitScholarshipForm(payload.id, payload.query).then(response => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    resolve();
                }).catch(error => {
                    commit('app/UPDATE_LOAD', false, {root: true});
                    reject(error);
                });
            });
        },
    },
};

export default paymentModule;
