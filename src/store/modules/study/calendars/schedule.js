import Schedule from '@/api/study/calendars/schedule';

const schedule = new Schedule();

const calendarScheduleModule = {

  namespaced: true,

  state: {
    items: [],
    item: null,
    total: 0,
    lookups: null,
    addlookups: null,
    load: false,
    selectedTimeType: 'regular_time',
    selectedCalendars: ['Lecture', 'Lab', 'Tutorial', 'Clinic'],
    calendarOptions: [
      {
        color: 'primary',
        label: 'Lecture',
        label_local: 'محاضرة'
      },
      {
        color: 'success',
        label: 'Lab',
        label_local: 'معمل'
      },
      {
        color: 'warning',
        label: 'Tutorial',
        label_local: 'دورة تعليمية'
      },
      {
        color: 'info',
        label: 'Clinic',
        label_local: 'عيادة'
      },
    ],
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
    lookups(state) {
      return state.lookups;
    },
    getAddLookups(state) {
      return state.addlookups;
    },
  },

  mutations: {
    SET_ITEMS: (state, items) => {
      state.items = items;
    },
    SET_ITEM: (state, item) => {
      state.item = item;
    },
    SET_ITEMS_LOAD: (state, load) => {
      state.load = load;
    },
    SET_TOTAL_ITEMS: (state, total) => {
      state.total = total;
    },
    SET_LOOKUPS: (state, load) => {
      state.lookups = load;
    },
    SET_ADD_LOOKUPS: (state, load) => {
      state.addlookups = load;
    },
    SET_SELECTED_EVENTS(state, val) {
      state.selectedCalendars = val
    },
    SET_SELECTED_EVENTS_TIME(state, val) {
      state.selectedTimeType = val
    },
  },

  actions: {
    fetchEvents({ commit }, { calendars , id , type}) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        schedule.list(id,type,calendars)
        .then(response => {
            commit('SET_ITEMS', response.data);

            if(type == "course"){
              commit('SET_LOOKUPS', response.meta.lookup);
              commit('app/UPDATE_PAGE_DETAILS', response.data.course, {root: true});
            }
            if(type == "instructor"){
              commit('SET_LOOKUPS', response.meta.lookup);
              commit('app/UPDATE_PAGE_DETAILS', response.data.instructor, {root: true});
            }
            if(type == "student"){
              // commit('SET_LOOKUPS', response.meta.lookup);
              commit('app/UPDATE_PAGE_DETAILS', response.data.student, {root: true});
            }
            if(type == "location"){
              commit('app/UPDATE_PAGE_DETAILS', response.data.location, {root: true});
            }
            commit('SET_ITEMS_LOAD', false);
            resolve();
          })
          .catch(error => {
            commit('SET_ITEMS_LOAD', false);
            reject(error);
          });
      });
    },
    getLookups({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        schedule.getLookups(payload.query)
          .then(response => {
            commit('SET_ADD_LOOKUPS', response.data);
            commit('SET_ITEMS_LOAD', false);
            resolve(response);
          })
          .catch(error => {
            commit('SET_ITEMS_LOAD', false);
            reject(error);
          });
      });
    },
    addEvent({ commit }, payload) {
      commit('SET_ITEMS_LOAD', true);
      return new Promise((resolve, reject) => {
        schedule.put(payload.id, payload.query)
          .then(response => {
            commit('SET_ITEMS_LOAD', false);
            resolve(response);
          })
          .catch(error => {
            commit('SET_ITEMS_LOAD', false);
            reject(error);
          });
      });
    },
    officeHoures({ commit }, payload) {
      commit('SET_ITEMS_LOAD', true);
      return new Promise((resolve, reject) => {
        schedule.officeHoures(payload.query, payload.id)
          .then(response => {
            commit('SET_ITEMS_LOAD', false);
            resolve(response);
          })
          .catch(error => {
            commit('SET_ITEMS_LOAD', false);
            reject(error);
          });
      });
    },
    get({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_ITEMS_LOAD', true);
        schedule.get(payload)
          .then(response => {
            commit('SET_ITEM', response.data);
            commit('SET_ITEMS_LOAD', false);
            resolve(response);
          })
          .catch(error => {
            commit('SET_ITEMS_LOAD', false);
            reject(error);
          });
      });
    },
    updateEvent({ commit }, payload) {
      commit('SET_ITEMS_LOAD', true);
      return new Promise((resolve, reject) => {
        schedule.put(payload.query.id, payload.query)
          .then(response => {
            commit('SET_ITEMS_LOAD', false);
            resolve(response);
          })
          .catch(error => {
            commit('SET_ITEMS_LOAD', false);
            reject(error);
          });
      });
    },

    removeEvent({ commit }, id) {
      return new Promise((resolve, reject) => {
        schedule.remove(id.id).then(response => {
          resolve();
        });
      });
    },
  }

}

export default calendarScheduleModule;
