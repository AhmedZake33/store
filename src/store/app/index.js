import { $themeBreakpoints } from '@themeConfig';
import Global from '../../api/system/global';
import Cookies from 'js-cookie'
const global = new Global();
export default {
  namespaced: true,
  state: {
    windowWidth: 0,
    shallShowOverlay: false,
    load: false,
    moreDetails: [],
    pageDetails: null,
    path: [],
    uploadProgress: false,
    errors: null,
    lookups: null,
    index_lookups: null,
    filter: null,
    tabsFilter: [],
    currentPaginationPage: 1,
    userLiveData: {
      chat_notification_count: 0,
    },
    universityData: null,
    mainUniversityData: null,
    groupedUniversityData: null,
    current_term: null,
    current_exam_term: null,
    current_admission_term: null,
    current_admission_term_pg: null,
    current_admission_term_ug: null,
    current_transfer_term: null,
    current_control_term: null,
    form_data: null,
    width: null,
    height: null,
    dropArray: [],
    terms: null,
    savedUrl: null,
    selectedTab: 0,
    selectedTabId: 0,
    updateRender: true,
    needDrop: true,
    scholarshipsLookups:[],
    MigrationModal:false,
    ExeclTableSort:null,
    stateLookups:{},
    dependentLookups:{},
    generalLoad:{},
    generalTotal:{}
  },
  getters: {
    stateLookups(state){
      if(Object.keys(state.stateLookups).length == 0) return false;
      return state.stateLookups;
    },
    dependentLookups(state){
      if(Object.keys(state.dependentLookups).length == 0) return false;
      return state.dependentLookups;
    },
    generalLoad:state=>{
      if(Object.keys(state.generalLoad).length == 0) return false;
      return state.generalLoad
    },
    generalTotal:state=>{
      if(Object.keys(state.generalTotal).length == 0) return 0;
      return state.generalTotal
    },
    needDrop: (state) => state.needDrop,
    mainUniversityData: (state) => state.mainUniversityData,
    groupedUniversityData: (state) => state.groupedUniversityData,
    universityData: (state) => {
      if (state.mainUniversityData) {
        var object = state.mainUniversityData.reduce(
          (obj, item) => Object.assign(obj, { [item.name]: item.value }),
          {}
        );
        return object;
      }
    },
    ExeclTableSort:(state)=>state.ExeclTableSort,
    savedUrl: (state) => state.savedUrl,
    lookups: (state) => state.lookups,
    updateRender: (state) => state.updateRender,
    form_data: (state) => state.form_data,
    indexLookups: (state) => state.index_lookups,
    filter: (state) => state.filter,
    width: (state) => state.width,
    height: (state) => state.height,
    dropArray: (state) => state.dropArray,
    load: (state) => state.load,
    selectedTab: (state) => state.selectedTab,
    pageDetails: (state) =>
      // state.pageDetails['print_code'] = null;
      state.pageDetails,
    path: (state) => state.path,
    moreDetails: (state) => JSON.parse(JSON.stringify(state.moreDetails)),
    uploadProgress: (state) => state.uploadProgress,
    currentBreakPoint: (state) => {
      const { windowWidth } = state;
      if (windowWidth >= $themeBreakpoints.xl) return 'xl';
      if (windowWidth >= $themeBreakpoints.lg) return 'lg';
      if (windowWidth >= $themeBreakpoints.md) return 'md';
      if (windowWidth >= $themeBreakpoints.sm) return 'sm';
      return 'xs';
    },
    updateSelectedTab(state) {
      if (state.dropArray && state.dropArray.length) {
        return state.dropArray.find(
          (el) => el && (el.id || el.id == 0) && el.id == state.selectedTabId
        );
      } else {
        return state.dropArray[0];
      }
    },
    tabsFilter: (state) => state.tabsFilter,
    terms: (state) => {
      return JSON.parse(Cookies.get('terms')) || state.terms
    },
    currentTerm: (state) => state.current_term,
    currentExamTerm: (state) => state.current_exam_term,
    currentControlTerm: (state) => state.current_control_term,
    currentAdmissionTerm: (state) => state.current_admission_term,
    currentAdmissionTermUG: (state) => state.current_admission_term_ug,
    currentAdmissionTermPG: (state) => state.current_admission_term_pg,
    currentTransferTerm: (state) => state.current_transfer_term,
    selectedTabId: (state) => state.selectedTabId,
    scholarshipsLookups: state => state.scholarshipsLookups,
    MigrationModal:state=>state.MigrationModal,
  },
  mutations: {
    SET_COMMIT_LOOKUPS(state,data){
      let obj = {};
      obj = {...obj,...state.stateLookups}
      obj[data.link] = data.data
      state.stateLookups = obj
    },
    SET_COMMIT_DEPENDENT_LOOKUPS(state,data){
      let obj = {};
      obj = {...obj,...state.dependentLookups}
      if(data.link){
        obj[data.link] = data.data
      }
      state.dependentLookups = obj
    },
    SET_GENERAL_LOAD(state,data){
      let obj = {};
      obj = {...obj,...state.generalLoad}
      obj[data.link] = data.data
      state.generalLoad = obj
    },
    SET_GENERAL_TOTAL(state,data){
      if(!data.data) return;
      let obj = {};
      obj = {...obj,...state.generalTotal}
      obj[data.link] = data.data
      state.generalTotal = obj
    },
    SET_EXECL_TABLE_SORT(state, val){
      state.ExeclTableSort = val
    },
    UPDATE_NEED_DROP(state, val) {
      state.needDrop = val;
    },
    UPDATE_MODAL(state, val) {
      state.MigrationModal = val;
    },
    UPDATE_PAGE_DETAILS(state, val) {
      state.pageDetails = val;
    },
    SAVE_URL(state, data) {
      state.savedUrl = data;
    },
    SELECTED_TAB_ID(state, data) {
      state.selectedTabId = data;
    },
    UPDATE_RENDER(state, data) {
      state.updateRender = data;
    },
    SET_FILTER(state, val) {
      state.filter = val;
    },
    SET_DATA_FORM(state, data) {
      state.form_data = data;
    },
    SET_PATH(state, val) {
      state.path = val;
    },
    BACK(state) {
      state.moreDetails.pop();
    },
    UPDATE_WIDTH(state, data) {
      state.width = data;
    },
    UPDATE_HEIGHT(state, data) {
      state.height = data;
    },
    UPDATE_TAB(state, data) {
      state.selectedTab = data;
    },
    DROP_ARRAY(state, data) {
      state.dropArray = data;
    },
    UPDATE_MORE_DETAILS(state, val) {
      state.moreDetails.push(val);
    },
    UPDATE_WINDOW_WIDTH(state, val) {
      state.windowWidth = val;
    },
    ERRORS(state, val) {
      state.errors = val;
    },
    UPDATE_LOAD(state, val) {
      state.load = val;
    },
    TOGGLE_OVERLAY(state, val) {
      state.shallShowOverlay =
        val !== undefined ? val : !state.shallShowOverlay;
    },
    SET_UPLOAD_PROGRESS(state, uploadProgress) {
      state.uploadProgress = uploadProgress;
    },
    SET_LOOKUPS(state, data) {
      state.lookups = data;
    },
    SET_SCHOLARSHIPS_LOOKUPS(state, data) {
      state.scholarshipsLookups = data
    },
    SET_INDEX_LOOKUPS(state, data) {
      state.index_lookups = data;
    },
    SET_TABS_FILTER(state, data) {
      state.tabsFilter[`${data.index}`] = data.filter;
    },
    RESET_TABS_FILTER(state) {
      state.tabsFilter = [];
    },
    SET_CURRENT_PAGE(state, val) {
      state.currentPaginationPage = val;
    },
    SET_USER_LIVE_DATA(state, val) {
      state.userLiveData = val;
    },
    SET_UNIVERSITY_DATA(state, val) {
      state.universityData = val;
    },
    SET_MAIN_UNIVERSITY_DATA(state, val) {
      state.mainUniversityData = val;
    },
    SET_GROUPED_UNIVERSITY_DATA(state, val) {
      state.groupedUniversityData = val;
    },
    SET_TERMS(state, val) {
      Cookies.set('terms', JSON.stringify(val))
      state.terms = val,
      state.current_term = val.current_term
      state.current_admission_term = val.current_admission_term,
      state.current_admission_term_ug = val.current_admission_term_UG,
      state.current_admission_term_pg = val.current_admission_term_PG,
      state.current_transfer_term = val.current_transfer_term,
      state.current_exam_term = null
      state.current_control_term = val.current_control_term
    },
  },
  actions: {
    async lookupsAction({ commit }, payload) {
      commit('SET_GENERAL_LOAD', {link:payload.link+'lookup',data:true});
       let response = await global.lookupsApi(payload)
        commit('SET_COMMIT_LOOKUPS', {link:payload.link,data:response.data})
        commit('SET_GENERAL_LOAD', {link:payload.link+'lookup',data:false})
    },
    async dependentLookupsAction({ commit }, payload) {
      commit('SET_GENERAL_LOAD', {link:payload.link+'lookup',data:true});
       let response = await global.dependentLookupsApi(payload)
        commit('SET_COMMIT_DEPENDENT_LOOKUPS', {link:payload.link,data:response.data})
        commit('SET_GENERAL_LOAD', {link:payload.link+'lookup',data:false})
    },
    GET_LOOKUPS({ commit }, lookupModules) {
      commit('app/UPDATE_LOAD', true, { root: true });
      return new Promise((resolve, reject) => {
        global.getLookups(lookupModules).then(response => {
          if(response.success){
            commit('SET_LOOKUPS', response.success)
          }

          if(lookupModules.scholarship_setting){
            commit('SET_SCHOLARSHIPS_LOOKUPS', response.success)
          }
          commit('app/UPDATE_LOAD', false, { root: true })
          resolve(response)
        })
      })
    },
    GET_INDEX_LOOKUPS({ commit }, lookupModules) {
      return new Promise((resolve, reject) => {
        global.getIndexLookups(lookupModules).then((response) => {
          commit('SET_INDEX_LOOKUPS', response.data);
          resolve(response);
        });
      });
    },
    updateTabsFilter({ commit }, data) {
      commit('SET_TABS_FILTER', data);
    },
    resetTabsFilter({ commit }) {
      commit('RESET_TABS_FILTER');
    },
    GET_USER_LIVE_DATA({ commit }, params) {
      return new Promise((resolve, reject) => {
        global.getUserLiveData(params).then((response) => {
          commit('SET_USER_LIVE_DATA', response.data);
        });
      });
    },
    GET_UNIVERSITY_DATA({ commit }, params) {
      return new Promise((resolve, reject) => {
        global.getUniversityData(params).then((response) => {
          commit('SET_MAIN_UNIVERSITY_DATA', response.data);
          resolve(response);
        });
      });
    },
    GET_GROUPED_UNIVERSITY_DATA({ commit }, params) {
      return new Promise((resolve, reject) => {
        global.getGroupedUniversityData(params).then((response) => {
          commit('SET_GROUPED_UNIVERSITY_DATA', response.data);
          resolve(response);
        });
      });
    },
    UPDATE_UNIVERSITY_DATA({ commit }, payload) {
      return new Promise((resolve, reject) => {
        global.UpdateUniversityData(payload)
          .then((response) => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    getTerms({ commit }, callback) {
      return new Promise((resolve, reject) => {
        global.getCurrentTerms()
          .then((res) => {
            //  res.data instead of this object
            commit('SET_TERMS', {
              current_admission_term: res.data.current_admission_term,
              current_admission_term_PG: res.data.current_admission_term_PG,
              current_admission_term_UG: res.data.current_admission_term_UG,
              current_control_term: res.data.current_control_term,
              current_exam_term: res.data.current_exam_term,
              current_term: res.data.current_term,
              current_transfer_term: res.data.current_transfer_term,
            });
            resolve({
              current_admission_term: res.data.current_admission_term_UG,
              current_admission_term_PG: res.data.current_admission_term_PG,
              current_admission_term_UG: res.data.current_admission_term_UG,
              current_control_term: res.data.current_control_term,
              current_exam_term: res.data.current_exam_term,
              current_term: res.data.current_term,
              current_transfer_term: res.data.current_transfer_term,
            });
            callback();
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
  },
};
