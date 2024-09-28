import ControlResults from '@/api/control/control_results/control_results'

const controlResults = new ControlResults()


const controlResultsModule = {
    namespaced: true,
    state: {
      lookups: [],
       
    },
    getters: {
     
        lookups(state) {
            return state.lookups
        },
       
    },
    mutations: {
       
        SET_LOOKUPS(state, lookups) {
            state.lookups = lookups
        },
       
    },
    actions: {
      
        getLookups({ commit }, payload) {
            return new Promise((resolve, reject) => {
              controlResults.controlLookups(payload).then(response => {
               commit('SET_LOOKUPS', response.success);
                resolve(response);
              }).catch(error => {
                reject(error.response.data.errors[0]);
              });
            });
        },
        getControlResult({commit},payload){
          return new Promise((resolve, reject) => {
            controlResults.getControlResult(payload).then(response => {
              resolve(response);
            }).catch(error => {
              reject(error.response.data.errors[0]);
            });
          });
        }
       
      
    },
};

export default controlResultsModule