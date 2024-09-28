<template>
  <div id="app" class="h-100" :class="[skinClasses]">
    <component :is="layout">
      <router-view />
    </component>
    <b-alert
      @dismissed="saveInCookie"
      v-model="showBottom"
      class="position-fixed custom_alert fixed-bottom m-0 rounded-0"
      style="z-index: 2000"
      variant="primary"
    >
      <strong v-if="$i18n.locale == 'en'" class="d-block mb-2"
        >We use cookies.</strong
      >
      <strong v-else class="d-block mb-2">
        نحن نستخدم ملفات تعريف الارتباط.</strong
      >
      <span class="d-block" v-if="$i18n.locale == 'en'">
        Octopi uses cookies and related technologies to improve the way our site
        functions for you as a visitor. A cookie is a text file that is stored
        on your device. We use these text files for functionality such as to
        analyze our traffic or to personalize content.<br />
      </span>
      <span class="d-block" v-else>
        يستخدم Octopi ملفات تعريف الارتباط والتقنيات ذات الصلة لتحسين طريقة عمل
        موقعنا لك كزائر. ملف تعريف الارتباط هو ملف نصي يتم تخزينه على جهازك. نحن
        نستخدم هذه الملفات النصية لوظائف مثل تحليل حركة المرور لدينا أو لتخصيص
        المحتوى.
      </span>
      <div class="d-flex justify-content-end w-100">
        <b-button
          @click="saveInCookie"
          size="sm"
          class="ml-1"
          variant="dark"
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        >
          {{ $t('Global.accept_cookie') }}
        </b-button>
      </div>
    </b-alert>
    <!-- <div id="idElementCreate" class="custom_none custom_visible custom_element_create">
      <b-dropdown v-if="rerender" block :text="selectedTab" variant="primary">
        <b-dropdown-item @click="setSelectedTab(tab)" :key="tab.id" v-for="tab in getDropTabs">
          {{ tab.name }}
        </b-dropdown-item>
      </b-dropdown>
    </div> -->

    <!-- <b-button id="idElementCreate" @click="showTabList($event)" class="custom_btn_iphone nav nav-tabs custom_none custom_visible custom_element_create">
      <ul onclick="" class="nav nav-tabs">
        <li class="nav-item d-flex justify-content-between">
          <a class="nav-link active d-flex" style="justify-content: space-between !important"
            ><span>{{ selectedTab }}</span> <feather-icon icon="ChevronDownIcon" class="font-medium-3" />
          </a>
        </li>
      </ul>
    </b-button> -->
    <!-- <scroll-to-top v-if="enableScrollToTop" /> -->
  </div>
</template>

<script>
const axios = require('axios');
import FeatherIcon from '@core/components/feather-icon/FeatherIcon.vue';
import ScrollToTop from '@core/components/scroll-to-top/ScrollToTop.vue';
// This will be populated in `beforeCreate` hook
import { $themeColors, $themeBreakpoints, $themeConfig } from '@themeConfig';
import { provideToast } from 'vue-toastification/composition';
import { watch } from '@vue/composition-api';
import useAppConfig from '@core/app-config/useAppConfig';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import { useWindowSize, useCssVar } from '@vueuse/core';
import {
  BAlert,
  BButton,
  BDropdown,
  BDropdownItem,
  BDropdownGroup,
} from 'bootstrap-vue';
import Cookies from 'js-cookie';
import store from '@/store';
import { getAuth } from '@/auth/utils';
import { mapGetters, mapActions } from 'vuex';

const LayoutVertical = () => import('@/layouts/vertical/LayoutVertical.vue');
const LayoutHorizontal = () =>
  import('@/layouts/horizontal/LayoutHorizontal.vue');
const LayoutFull = () => import('@/layouts/full/LayoutFull.vue');

export default {
  components: {
    // Layouts
    LayoutHorizontal,
    LayoutVertical,
    BDropdown,
    BDropdownItem,
    BDropdownGroup,
    FeatherIcon,
    BButton,
    LayoutFull,
    BAlert,
    ScrollToTop,
  },
  data() {
    return {
      showBottom: false,
      timer: null,
      dropTabs: [],
      selectedTabTimer: null,
      selectedTab: null,
      inputTab: null,
      tabTimer: null,
      rerender: true,
      selectedId: 0,
      logoutTimeoutID: undefined,
    };
  },

  // ! We can move this computed: layout & contentLayoutType once we get to use Vue 3
  // Currently, router.currentRoute is not reactive and doesn't trigger any change
  computed: {
    ...mapGetters({
      currentTerm: 'app/currentTerm',
      exam_term: 'app/currentExamTerm',
      admission_term: 'app/currentAdmissionTerm',
      control_term: 'app/currentControlTerm',
    }),
    layout() {
      if (this.$route.meta.layout === 'full') return 'layout-full';
      if (this.authUser().id) {
        return `layout-${this.contentLayoutType}`;
      }
    },
    getDropTabs() {
      if (this.dropTabs) {
        return this.dropTabs;
      }
    },
    getSelectedTab() {
      if (this.dropTabs) {
        return this.dropTabs.find((el) => el.id == this.selectedTab);
      } else {
        return this.dropTabs[0];
      }
    },
    contentLayoutType() {
      return this.$store.state.appConfig.layout.type;
    },
    currentBreakPoint() {
      if (this.$store.getters['app/currentBreakPoint']) {
        return this.$store.getters['app/currentBreakPoint'];
      }
    },
    width() {
      if (this.$store.getters['app/width']) {
        return this.$store.getters['app/width'];
      }
    },
    tabNum() {
      return this.$route.query.tabNum || 0;
    },
  },
  beforeUpdate() {},
  updated() {
    this.timer = setInterval(() => {
      const selectedTabElement = document.querySelector(
        '.nav-tabs.flex-column .nav-item .nav-link.active span'
      );
      if (selectedTabElement) {
        this.selectedTab = selectedTabElement.textContent;
      }
    }, 1000);
  },
  watch: {
    tabNum() {
      this.showTabList();
    },
    $route(to, from) {
      // if(from.params.id){
      //   const selectedElement = document.querySelector('.custom_element_create');
      //   if(selectedElement){
      //     selectedElement.classList.remove('custom_visible')
      //   }
      // }else{
      //   selectedElement.classList.add('custom_visible')
      // }
      // this.rerender = false;
      // setTimeout(() => {
      //   this.rerender = true
      // }, 200);
      if (from.name != to.name) {
        let selectedElement = document.querySelector('body #idElementCreate');
        if (selectedElement) {
          document.body.appendChild(selectedElement);
          setTimeout(() => {
            selectedElement.classList.add('custom_none');
          }, 200);
        }
      }
      setTimeout(() => {
        this.$nextTick(() => {
          // this.init();
        });
      }, 3000);
      // if (this.authUser().id) {
      //   this.$store.dispatch('roles/getAuthUserRolesPermissions', this.authUser().id);
      // }
      // this.$store.commit('app/UPDATE_PAGE_DETAILS',null)
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.tabTimer);
    clearInterval(this.selectedTabTimer);
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResizeGlobal);
  },
  beforeCreate() {
    // axios
    //   .get(`${process.env.VUE_APP_BASE_URL}/system/current-terms`)
    //   .then((res) => {
    //     this.$store.commit('app/SET_TERMS', {
    //       current_admission_term: res.data.data.current_admission_term,
    //       current_admission_term_PG: res.data.data.current_admission_term_PG,
    //       current_admission_term_UG: res.data.data.current_admission_term_UG,
    //       current_control_term: res.data.data.current_control_term,
    //       current_exam_term: res.data.data.current_exam_term,
    //       current_term: res.data.data.current_term,
    //       current_transfer_term: res.data.data.current_transfer_term,
    //     });
    //   });
    this.$store.commit('verticalMenu/initialiseVars');
    // Set colors in theme
    const colors = [
      'primary',
      'secondary',
      'success',
      'info',
      'warning',
      'danger',
      'light',
      'dark',
    ];

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = colors.length; i < len; i++) {
      $themeColors[colors[i]] = useCssVar(
        `--${colors[i]}`,
        document.documentElement
      ).value.trim();
    }

    // Set Theme Breakpoints
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'];

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = breakpoints.length; i < len; i++) {
      $themeBreakpoints[breakpoints[i]] = Number(
        useCssVar(
          `--breakpoint-${breakpoints[i]}`,
          document.documentElement
        ).value.slice(0, -2)
      );
    }

    // Set RTL
    const { isRTL } = $themeConfig.layout;
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  },
  mounted() {
    this.handleResizeGlobal();
    window.addEventListener('resize', this.handleResizeGlobal);
    // setTimeout(() => {
    //   this.$nextTick(() => {
    //     this.init();
    //   });
    // }, 3000);
    if (this.$store.state.verticalMenu.use_cookie) {
      this.showBottom = false;
    } else {
      this.showBottom = true;
    }
    this.$bvToast.show('my-toast');

    // this.$toast({
    //     component: ToastificationContent,
    //     props: {
    //       title: 'Notification',
    //       icon: 'InfoIcon',
    //       text: 'I do not think that word means what you think it means.',
    //       variant:'info',
    //       no-auto-hide
    //     },
    //   },
    //   {
    //     position:"bottom-center",
    //   })

    // for live data chat notification and other
    if (this.authUser().id) {
    setInterval(() => {
    }, 180000);
    }
    const events = ['click', 'mousemove', 'mousedown', 'keydown'];
    this.logoutTimeoutID = setTimeout(this.callTimeoutFunc, 10800 * 1000);
    if (this.$route.name == 'auth-login') {
      clearTimeout(this.logoutTimeoutID);
    } else {
      events.forEach((event) => {
        window.addEventListener(event, this.eventHandler);
      });
    }
  },
  methods: {
    ...mapActions({
      updateTabsFilter: 'app/updateTabsFilter',
    }),
    eventHandler() {
      if (this.$route.name == 'auth-login') {
        clearTimeout(this.logoutTimeoutID);
      }
      clearTimeout(this.logoutTimeoutID);
      this.logoutTimeoutID = setTimeout(this.callTimeoutFunc, 10800 * 1000);
    },
    callTimeoutFunc() {
      this.$store.dispatch('users/logout').then((_) => {
        this.$router.push({ name: 'auth-login' });
      });
    },
    async init() {
      const parentElement = document.querySelector('.nav-tabs');
      const tabs = document.querySelector('.tabs');
      const selectedElement = document.querySelector(
        '#idElementCreate.custom_element_create'
      );
      if (tabs) {
        if (this.width <= 995) {
          if (selectedElement) {
            parentElement.parentNode.insertBefore(
              selectedElement,
              parentElement
            );
            selectedElement.classList.remove('custom_none');
          }
        } else {
          if (selectedElement) {
            selectedElement.classList.add('custom_none');
          }
        }
      } else {
        if (selectedElement) {
          selectedElement.classList.add('custom_none');
        }
      }
      await this.getTabs();
    },
    getTabs() {
      let dropArray = [];
      let tab = document.querySelectorAll(
        '.tabs .nav-hidden .nav-tabs.flex-column li'
      );
      if (tab) {
        tab.forEach((element, i) => {
          this.dropTabs[i] = { name: element.innerText, id: i };
        });
      }
      return this.dropTabs;
    },
    showTabList(e) {
      // alert('')
      // if (e) e.preventDefault();
      // const tabList = document.querySelector('.tabs .nav-hidden .nav-tabs.flex-column');
      // if (tabList) {
      //   if (tabList.classList.contains('visible_class')) {
      //     tabList.classList.remove('visible_class');
      //   } else {
      //     tabList.classList.add('visible_class');
      //   }
      // }
      // return false;
      // let offsets = document.querySelector('.tabs .tab-pane.active').getBoundingClientRect()
      // // let left = document.querySelectorAll('.tabs .tab-pane')[0].getBoundingClientRect()
      // window.scrollTo(offsets.left, offsets.top);
    },
    saveInCookie() {
      Cookies.set('use_cookie', true);
      this.$store.commit('verticalMenu/UPDATE_USE_COOKIE', true);
      this.showBottom = false;
    },
  },
  setup() {
    const { skin, skinClasses } = useAppConfig();
    // const { enableScrollToTop } = $themeConfig.layout;

    // If skin is dark when initialized => Add class to body
    if (skin.value === 'dark') document.body.classList.add('dark-layout');

    // Provide toast for Composition API usage
    // This for those apps/components which uses composition API
    // Demos will still use Options API for ease
    provideToast({
      hideProgressBar: true,
      closeOnClick: false,
      closeButton: false,
      icon: false,
      timeout: 3000,
      transition: 'Vue-Toastification__fade',
    });

    // Set Window Width in store
    store.commit('app/UPDATE_WINDOW_WIDTH', window.innerWidth);
    const { width: windowWidth } = useWindowSize();
    watch(windowWidth, (val) => {
      store.commit('app/UPDATE_WINDOW_WIDTH', val);
      // const parentElement = document.querySelector('.nav-tabs');
      // const tabs = document.querySelector('.tabs');
      // const selectedElement = document.querySelector('#idElementCreate.custom_element_create');
      // if (tabs) {
      //   if (val <= 995) {
      //     if (selectedElement) {
      //       parentElement.parentNode.insertBefore(selectedElement, parentElement);
      //       selectedElement.classList.remove('custom_none');
      //     }
      //   } else {
      //     if (selectedElement) {
      //       selectedElement.classList.add('custom_none');
      //     }
      //   }
      // } else {
      //   if (selectedElement) {
      //     selectedElement.classList.add('custom_none');
      //   }
      // }
    });

    return {
      skinClasses,
      // enableScrollToTop,
    };
  },
};
</script>

<style lang="scss">
@media screen and (min-width: 980px) {
  .tabs.row {
    flex-wrap: nowrap;
    .tab-content {
      width: 900px;
    }
  }
}
.custom_action_drop {
  button {
    padding: 0;
  }
}
.content-body:not( .custom_actions) .dropdown .dropdown-menu.show {
  max-height: 400px;
  overflow: scroll;
}
.content-body .custom_actions .dropdown .dropdown-menu.show {
  overflow: unset;
}
/**/
// .banner_slider .prev{
//   display: none !important;
// }
.custom_underline {
  border-bottom: 5px solid #eee;
  padding-bottom: 6px;
}

[v-cloak] {
  display: none;
}
.tabs .custom_btn_iphone {
  background-color: transparent !important;
  border-color: transparent !important;
  box-shadow: none !important;
}
.tabs .custom_btn_iphone:focus,
.tabs .custom_btn_iphone:active,
.tabs .custom_btn_iphone.active {
  background-color: transparent !important;
  border-color: transparent !important;
  box-shadow: none !important;
}
#idElementCreate {
  cursor: pointer;
}
.w-70 .tabs .tab-content {
  width: 70%;
}
[dir='rtl'] .page-item.prev-item .page-link svg {
  transform: rotate(180deg) !important;
}
.visible_class {
  display: -webkit-inline-box !important;
  display: inline-box !important;
  // opacity: 1 !important;
  height: auto !important;
}
.custom_none {
  // opacity: 0;
  display: none !important;
  position: absolute !important;
  z-index: -9999 !important;
}
// .custom_element_create {
//   display: 0 !important;
// }
@media screen and (max-width: 995px) {
  .nav-tabs.flex-column {
    display: none;
    height: 0;
  }
  .custom_element_create,
  .nav-tabs {
    flex-wrap: wrap !important;
    li {
      width: 100%;
    }
  }
}
.custom_inline {
  display: flex;
  legend {
    float: left;
    width: auto;
    margin: 0 0.5rem;
  }
}

.tabs.row {
  flex-wrap: wrap;
}

//Start To prevent card from go to bottom
@media screen and (min-width: 980px) {
  .tabs.row {
    flex-wrap: nowrap;
    .tab-content {
      width: 900px;
    }
  }
}
//End To prevent card from go to bottom

//Start To make tabs slider
// .nav.nav-tabs.flex-column {
//   border-right: 1px solid #ddd;
//   padding-right: 10px;
//   &:hover {
//     .nav-item {
//       width: 100%;
//       transition: width 0.2s ease-in-out;

//       span {
//         display: inline-block;
//         opacity: 1;
//       }
//     }
//   }
//   .nav-item {
//     width: 40px;
//     .nav-link{
//       padding: 0.786rem 1rem;
//     }
//     .nav-link.active {
//       display: flex;
//       // padding: 0.786rem 1rem;
//     }
//     display: flex;
//     height: 40px;
//     a {
//       div{
//             align-items: center;
//     display: flex;
//       }
//       svg {
//         flex: none;
//       }
//     }
//     width: 45px;
//     transition: width 0.3s ease-in-out;
//     span {
//       white-space: nowrap;
//       overflow: hidden;
//       transition: opacity 0.3s ease-out;
//       text-overflow: ellipsis;
//       opacity: 0;
//     }
//   }
// }
//End To make tabs slider
@media screen and (max-width: 680px) {
  .custom_actions {
    position: absolute;
    top: -33px !important;
    right: 0;
    z-index: 10;
  }
  .breadcrumb-wrapper .breadcrumb {
    width: calc(100% - 60px);
  }
  .custom_alert.alert-primary {
    padding: 0.5rem 2rem !important;
  }
}
.custom_actions {
  position: absolute;
  top: -38px;
  right: 0;
  z-index: 10;
}
.ml-05 {
  margin-left: 4px;
}
[dir='ltr'] .ml-05 {
  margin-left: 0px;
  margin-right: 4px;
}
.per-page-selector .vs__dropdown-toggle {
  min-width: 80px !important;
}
.per-page-selector .vs__dropdown-menu {
  top: calc(-400% + 1rem) !important;
}
.new_edit {
  .b-form-datepicker {
    margin-bottom: 0 !important;
  }
  ::placeholder {
    color: #777 !important;
    opacity: 0.8 !important;
  }
  td {
    padding: 0.2rem 23px !important;
    padding-inline-start: 25px !important;
  }
  tr {
    align-items: center;
  }
  textarea.form-control {
    padding: 0.2rem 0.5rem !important;
  }
  .form-group {
    .vs--disabled {
      background-color: #f8f8f8;
    }
    .vs__selected {
      padding: 0;
      margin: 0;
    }
    .v-select div {
      flex-direction: row !important;
    }
    margin-bottom: 0;
    width: 100%;
    padding-left: 0px;
    padding-right: 8px;
    .vs__selected,
    .vs__search {
      margin-top: 0 !important;
    }
    .form-control,
    .vs__dropdown-toggle {
      border: 0;
      box-shadow: 0 3px 10px 0 rgb(34 41 47 / 10%);
      // border-left: 1px dashed #777;
      background: transparent;
      background-color: transparent !important;
      height: 30px;
      padding: 0.2rem 0.5rem;
    }
    .form-control.text-break {
      box-shadow: none !important;
    }
    .vs--searchable:not(.vs--single) .vs__dropdown-toggle {
      height: auto !important;
    }
    .vs--searchable.vs--single {
      .vs__dropdown-toggle {
        margin-bottom: 0;
      }
      margin-bottom: 0;
    }
  }
}
.b-table thead tr th {
  vertical-align: middle;
}

span .vue-form-wizard .wizard-navigation .wizard-nav li a .wizard-icon-circle {
  margin-right: 0.5rem !important;
}
.vue-form-wizard .wizard-nav.wizard-nav-pills li {
  padding-bottom: 0rem !important;
}
.custom_alert.alert-primary {
  background: rgba(5, 73, 120, 1) !important;
  color: #fff !important;
  padding: 1rem 18rem;
}
.custom_alert.alert {
  padding: 0.71rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.358rem;
}
.cookie_note {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100px;
  background: #054978;
}
.feather-edit {
  color: #054978;
}
[dir='rtl']
  .vertical-layout.vertical-menu-modern
  .main-menu
  ul
  .navigation
  li.has-sub
  a:after {
  transform: rotate(180deg) !important;
}
.b-form-datepicker {
  .dropdown-menu.show {
    z-index: 999 !important;
  }
}
html[dir='rtl'] body .v-select {
  direction: rtl !important;
}
[dir='rtl'] .vs__search,
[dir='rtl'] .vs__search:focus {
  text-align: right;
}
.year-picker .year-picker__input--real {
  height: 37px !important;
}
.year-picker .year-picker__input {
  width: 100% !important;
}
.year-picker {
  width: 100% !important;
  margin-left: 0 !important;
}
html[dir='rtl']
  .vue-form-wizard
  .wizard-card-footer
  .wizard-footer-right
  .wizard-btn::after {
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
  display: inline-block;
}
.no_hover {
  &.btn-flat-primary:hover:not(.disabled):not(:disabled) {
    background-color: transparent !important;
    color: #746d69;
  }
  &.btn-flat-primary {
    color: #746d69;
  }
}
.vue-form-wizard {
  box-shadow: none !important;
}
.vue-form-wizard
  .wizard-navigation
  .wizard-nav
  li.active
  a
  .wizard-icon-circle {
  .wizard-icon {
    color: #dae1e7 !important;
  }
}
.wizard-nav.wizard-nav-pills li {
  padding-bottom: 0.5rem !important;
}
.vue-form-wizard .wizard-navigation .wizard-nav li a .wizard-icon-circle {
  box-shadow: none !important;
  margin-right: 0.2rem !important;
  width: auto !important;
  background-color: transparent !important;
  height: auto;
  .wizard-icon {
    color: #746d69 !important;
  }
  .wizard-icon-container {
    border-radius: 0px;
  }
}
.wizard-navigation .wizard-nav.wizard-nav-pills li a {
  background-color: transparent !important;
  border-color: #ededed #ededed #dae1e7;
  border-radius: 0.2rem;
  padding: 0.786rem 1rem;
  .wizard-icon-circle {
    // display: none;
  }
  span {
    color: #746d69 !important;
    font-weight: 450 !important;
  }
}
.wizard-navigation .wizard-nav.wizard-nav-pills li.active a {
  background-color: #054978 !important;
  border-color: #054978 !important;
  border-radius: 0.2rem;
  padding: 0.786rem 1rem;
  .wizard-icon-circle {
    // display: none;
  }
  span {
    color: #fff !important;
    font-weight: normal !important;
  }
}
[dir='ltr'] .vertical.wizard-vertical.vue-form-wizard .wizard-card-footer {
  margin-left: 259px !important;
}
[dir='rtl'] .vertical.wizard-vertical.vue-form-wizard .wizard-card-footer {
  margin-right: 258px !important;
}
.vertical.wizard-vertical.vue-form-wizard .wizard-navigation .wizard-nav {
  min-width: 260px !important;
  border: none !important;
}
.custom_drop {
  .dropdown-menu {
    width: 100%;
    // top: 140px !important;
  }
  .dropdown {
    .dropdown-toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
@media screen and (max-width: 980px) {
  .nav.nav-tabs {
    display: -webkit-inline-box;
    width: 100%;
    flex-wrap: nowrap;
    overflow: scroll;
  }
}
@media screen and (max-width: 982px) {
  .custom_slider {
    display: none;
  }
}
@media screen and (max-width: 680px) {
  .mt-sm-2 {
    margin-top: 4px;
  }
}
.custom_search {
  width: 50%;
}
.custom_link:hover {
  text-decoration: underline;
}
.custom_hover:hover {
  color: #000;
}
[dir='ltr'] .right_left {
  direction: rtl !important;
}
[dir='rtl'] .left_right {
  direction: ltr !important;
}
[dir='rtl'] .left_right > * {
  direction: ltr !important;
}
.custom_invalid {
  .input-group-text,
  .vs1__combobox,
  .vs__dropdown-toggle {
    border-color: #ea5455;
  }
}
.top_100 {
  .dropdown-menu {
    top: 100px !important;
  }
}
.top_0 {
  .dropdown-menu {
    top: 0px !important;
  }
}
.top_20 {
  .dropdown-menu {
    top: 20px !important;
  }
}
.disabled_with_tooltip {
  opacity: 0.2;
  cursor: not-allowed;
}
.disabled_all {
  pointer-events: none;
  opacity: 0.2;
  cursor: not-allowed;
}
.disabled_all2 {
  pointer-events: none;
  cursor: not-allowed;
  color: gray;
}
html {
  scroll-behavior: smooth;
}
.card {
  box-shadow: none !important;
}
.header-navbar.navbar-shadow {
  box-shadow: none !important;
}
.gap {
  gap: 0.5rem;
}
[dir='ltr']
  .table.b-table.table-sm
  > thead
  > tr
  > [aria-sort]:not(.b-table-sort-icon-left),
[dir='ltr']
  .table.b-table
  > tfoot
  > tr
  > [aria-sort]:not(.b-table-sort-icon-left) {
  background-position: left calc(1rem / 4) center !important;
}
[dir='ltr']
  .table.b-table
  > thead
  > tr
  > [aria-sort]:not(.b-table-sort-icon-left),
[dir='ltr']
  .table.b-table
  > tfoot
  > tr
  > [aria-sort]:not(.b-table-sort-icon-left) {
  background-position: left calc(2.5rem / 3) center !important;
}
[dir='rtl']
  .table.b-table
  > thead
  > tr
  > [aria-sort]:not(.b-table-sort-icon-left),
[dir='ltr']
  .table.b-table
  > tfoot
  > tr
  > [aria-sort]:not(.b-table-sort-icon-left) {
  background-position: right calc(2.5rem / 2) center !important;
}
.w-80 {
  width: 250px;
}
.custom-file-label {
  cursor: pointer !important;
}

.mask_gradient_left {
  -webkit-mask-image: linear-gradient(to left, black 70%, transparent 120%);
  mask-image: linear-gradient(to left, black 70%, transparent 120%);
}
.mask_gradient_right {
  -webkit-mask-image: linear-gradient(to right, black 73%, transparent 100%);
  mask-image: linear-gradient(to right, black 73%, transparent 100%);
}
.nav-pills .nav-link,
.nav-tabs .nav-link {
  justify-content: start !important;
}
.nav-item .nav-link.active {
  border-color: #054978 !important;
  background-color: #054978 !important;
  box-shadow: none;
  text-align: start;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.786rem 1.5rem;
  border-radius: 0.2rem;
  margin: 0;
  color: #fff !important;
  font-weight: 500;
  display: block;
  width: 100%;
  display: inline-block;
  font-weight: 400;
  color: #746d69;
  vertical-align: middle;
  user-select: none;
  font-size: 1rem;
  line-height: 1;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, background 0s,
    border 0s;
  text-transform: none;
  font-family: inherit;
}
.nav-hidden ul li a::after {
  display: none;
}
.cover {
  background-size: cover;
}
.pointer {
  cursor: pointer !important;
}
.mr-05 {
  margin-right: 5px;
}
.mx-05 {
  margin-right: 5px;
  margin-left: 5px;
}
.customWidth {
  width: 100px;
  margin: 0px;
  text-align: end;
}
.customDetailsWidth {
  width: 150px;
  margin: 0px;
  text-align: end;
}
.customWidth > div,
.customDetailsWidth > div {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding-inline-end: 9px;
}
.customAction {
  text-align: end;
}
.customAction div {
  margin: 0px 1rem;
}
#myHeader {
  position: fixed;
  z-index: 9;
  margin-top: -15px;
  min-height: auto !important;
}
.sticky {
  background: #fff;
  margin-top: -35px !important;
}
.main-menu.menu-light .navigation > li ul li > a {
  padding-left: 10px !important;
}
.modal .modal-header .close {
  margin: 0;
}

.vs--single {
  .vs__selected-options {
    width: 0;
  }
  .vs__selected {
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100%;
    overflow: hidden;
  }
}

// .vs__dropdown-toggle{
//   height: 100% !important;
// }
</style>
