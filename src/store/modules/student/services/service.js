
import Service from '../../../../api/student/services/service';

const service = new Service();

const serviceModules = {
    namespaced: true,
    state: {
        services: [],
        total: null,
        load: false,
        requests: [],
        totalRequests:null,
        lookups:[],
        request:null
    },
    getters: {
        services(state){
            return state.services;
        },
        totalServices(state){
            return state.total;
        },
        load(state){
            return state.load;
        },
        requests(state){
            return state.requests;
        },
        totalRequests(state){
            return state.totalRequests
        },
        lookups(state){
            return state.lookups
        },
        request(state){
            return state.request
        }
    },
    mutations: {
        SET_SERVICES: (state, services) => {
            state.services = services;
        },
        SET_TOTAL_SERVICES: (state, total) => {
            state.total = total;
        },
        SET_LOAD: (state, load) => {
            state.load = load;
        },
        SET_REQUESTS: (state , requests) => {
            state.requests = requests;
        },
        SET_TOTAL_REQUESTS(state , totalRequests){
            state.totalRequests = totalRequests;
        },
        SET_LOOKUPS(state , lookups){
            state.lookups = lookups;
        },
        SET_REQUEST(state , request){
            state.request = request;
        }
    },
    actions:{
        services({commit},payload){
            return new Promise((resolve, reject) => {
                commit('SET_LOAD', true);
                service.services()
                .then((response)=>{
                    commit('SET_SERVICES',response.data);
                    commit('SET_TOTAL_SERVICES',response.meta.count);
                    commit('SET_LOAD', false);
                    resolve();
                }).catch((error)=>{
                    reject(error);
                });

            })
        },
        requests({commit} , payload){
            return new Promise((resolve , reject) => {
                commit('SET_LOAD', true);
                service.requests(payload.query)
                .then((response) => {
                    commit('SET_LOAD', false);
                    commit('SET_REQUESTS',response.data);
                    commit('SET_TOTAL_REQUESTS',response.meta.count);
                    commit('SET_LOOKUPS',response.meta.lookup);
                    resolve();
                }).catch((error)=> {
                    reject(error);
                })
            })
        },
        getRequest({commit} , id){
            return new Promise((resolve , reject) => {
                commit('SET_LOAD', true);
                service.getRequest(id)
                .then((response) => {
                    commit('SET_LOAD', false);
                    commit('SET_REQUEST' , response.data);
                    commit('SET_LOOKUPS',response.meta.lookups);
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })

            })
        },
        updateStatus({commit} , payload){
            return new Promise((resolve , reject) => {
                commit('SET_LOAD', true);
                service.updateStatus(payload)
                .then((response) => {
                    commit('SET_LOAD', false);
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
            })
        },
        delete({commit} , payload){
            return new Promise((resolve , reject) => {
                commit('SET_LOAD', true);
                service.delete(payload)
                .then((response)=>{
                    commit('SET_LOAD', false);
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                })
            })
        }
    },
};

export default serviceModules;