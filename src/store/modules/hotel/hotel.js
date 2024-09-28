import Hotels from '../../../api/hotel/hotel';

const Hotel = new Hotels();

const Hotelmodule = {
    namespaced: true,
    state: {
        load: false,
        reservations: [],
        totalReservations:null,
        lookups: [],
        reservation:null
    },
    getters: {
        reservations(state){
            return state.reservations
        },
        load(state){
            return state.load
        },
        lookups(state){
            return state.lookups
        },
        totalReservations(state){
            return state.totalReservations
        },
        reservation(state){
            return state.reservation
        }
    },
    mutations: {
        SET_RESERVATIONS(state, reservations){
            state.reservations = reservations
        },
        SET_TOTAL_RESERVATIONS(state, totalReservations){
            state.totalReservations = totalReservations;
        },
        SET_LOAD(state, load){
            state.load = load
        },
        SET_LOOKUPS(state, lookups){
            state.lookups = lookups
        },
        SET_RESERVATION(state , reservation){
            state.reservation = reservation
        }
    },
    actions: {
        reservations({commit},payload){
            return new Promise((resolve, reject) => {
                commit('SET_LOAD', true);
                Hotel.reservations(payload)
                .then((response)=>{
                    commit('SET_RESERVATIONS',response.data);
                    commit('SET_TOTAL_RESERVATIONS',response.meta.count);
                    commit('SET_LOOKUPS',response.meta.lookup);
                    commit('SET_LOAD', false);
                    resolve();
                }).catch((error)=>{
                    reject(error);
                });

            })
        },
        lookups({commit}){
            return new Promise((resolve , reject) => {
                commit('SET_LOAD', true);
                Hotel.lookups()
                .then((response) => {
                    commit('SET_LOOKUPS',response.data);
                    commit('SET_LOAD', false);
                    resolve(response);
                }).catch((error) => {
                    reject(error)
                })
            })
        },
        create({commit},payload){
            return new Promise((resolve, reject) => {
                commit('SET_LOAD', true);
                Hotel.create(payload)
                .then((response) => {
                    commit('SET_LOAD', false);
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                })
            })
        },
        reservation({commit} , id){
            return new Promise((resolve , reject) => {
                commit('SET_LOAD', true);
                Hotel.reservation(id)
                .then((response) => {
                    commit('SET_LOAD', false);
                    commit('SET_RESERVATION',response.data);
                    commit('SET_LOOKUPS',response.meta.lookups);
                }).catch((error) => {
                    reject(error);
                })
            })
        },
        updateStatus({commit} , payload){
            return new Promise((resolve , reject) => {
                commit('SET_LOAD', true);
                Hotel.updateStatus(payload)
                .then((response) => {
                    commit('SET_LOAD', false);
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                })
            })
        },
        delete({commit},payload){
            return new Promise((resolve , reject) => {
                commit('SET_LOAD', true);
                Hotel.delete(payload.id)
                .then((response) => {
                    commit('SET_LOAD', false);
                    resolve();
                }).catch((error) => {
                    reject(error);
                })
            })
        },
    }
}

export default Hotelmodule;