<template>
  <div>
    <b-card no-body>
      <b-card-header v-if="title" class="text-white pb-0 w-100">
        <b-row class="d-flex justify-content-between w-100">
          <b-col cols="12" md="6">
            <h3
              :style="titleFontSize ? 'font-size:' + titleFontSize + 'px' : ''"
              class="m-0"
            >
              {{ title }}
            </h3>
          </b-col>
          <b-col v-if="allowSearch && title" cols="12" md="5" sm="2">
            <div class="d-flex">
              <b-input-group
                v-if="allowFilterWithoutSearch"
                :class="visible ? 'mb-2' : ''"
                class="input-group-merge"
              >
                <b-input-group-prepend is-text>
                  <feather-icon
                    @click="Refresh(true)"
                    icon="SearchIcon"
                    class="pointer"
                  />
                </b-input-group-prepend>
                <b-form-input
                  v-model="search"
                  @keydown.enter.native="Refresh(true)"
                  :placeholder="$t('Global.search_text')"
                />
              </b-input-group>
              <b-button
                :class="visible ? 'align-self-baseline' : ''"
                v-b-tooltip.hover="$t('Global.filter')"
                v-if="!!$slots.filter"
                variant="primary"
                class="btn-icon ml-2"
                v-b-toggle.filter
              >
                <feather-icon
                  icon="SlidersIcon"
                  v-if="queryParamsFounded"
                  badge-classes="badge-danger"
                  badge-style="margin-top: -9px;margin-right: -12px;"
                />

                <feather-icon icon="SlidersIcon" v-else />
              </b-button>
              <slot name="more"></slot>
            </div>
          </b-col>
        </b-row>
      </b-card-header>
      <slot name="custom_action"></slot>
      <hr class="mb-0" v-if="title && !allowActions" />
      <div
        :class="
          !!$slots.filter && visible
            ? 'mx-2 my-1'
            : !title
            ? 'my-1 mx-2'
            : 'mx-2'
        "
      >
        <b-row class="d-flex justify-content-end mb-1">
          <b-col v-if="allowSearch && !title">
            <div class="d-flex w-100 justify-content-between">
              <b-input-group
                v-if="allowFilterWithoutSearch"
                :class="visible ? 'mb-2' : 'm-0'"
                class="input-group-merge w-50"
              >
                <b-input-group-prepend is-text>
                  <feather-icon
                    @click="Refresh(true)"
                    icon="SearchIcon"
                    class="pointer"
                  />
                </b-input-group-prepend>
                <b-form-input
                  v-model="search"
                  @keydown.enter.native="Refresh(true)"
                  :placeholder="$t('Global.search_text')"
                />
              </b-input-group>
              <slot v-else name="studentSerach"></slot>
              <b-button
                :class="visible ? 'align-self-start' : ''"
                v-b-tooltip.hover="$t('Global.filter')"
                v-if="!!$slots.filter"
                variant="primary"
                class="btn-icon ml-1"
                v-b-toggle.filter
              >
                <feather-icon
                  icon="SlidersIcon"
                  v-if="queryParamsFounded"
                  badge=" "
                  badge-classes="badge-danger"
                  badge-style="margin-top: -9px;margin-right: -12px;"
                />
                <feather-icon icon="SlidersIcon" v-else />
              </b-button>
            </div>
          </b-col>
          <b-button
            v-if="resetMargin && !title && $slots.filter && allowReset"
            :class="[
              visible ? ' align-self-start' : '',
              resetMargin ? 'mr-1' : '',
            ]"
            v-b-tooltip.hover="$t('Global.reset')"
            class="btn-icon"
            variant="primary"
            @click="reset"
          >
            <feather-icon icon="RotateCwIcon" />
          </b-button>
          <div style="margin-inline-end: 15px">
            <slot v-if="!title || allowActions" name="action"></slot>
            <b-button
              @click="show = true"
              v-if="exportPermission && hasPermission(exportPermission)"
              class="btn-icon"
              v-b-tooltip.hover="$t('Global.export')"
              variant="primary"
            >
              <feather-icon icon="FileTextIcon" />
            </b-button>
            <b-button
              v-b-tooltip.hover="$t('Global.importMigrationData')"
              :class="'ml-1'"
              class="btn-icon"
              variant="primary"
              @click="toggleMigrationModal"
              v-if="hasPermission('import_migrationData') && importBtn"
            >
              <feather-icon icon="UploadCloudIcon" />
            </b-button>
            <b-button
              @click="Export(0)"
              v-if="hasPermission('export_bylaw') && innerExport && !basicTable"
              class="btn-icon ml-1"
              v-b-tooltip.hover="$t('Global.export_excel')"
              variant="primary"
            >
              <feather-icon icon="FileTextIcon" />
            </b-button>
            <b-button
              @click="Export(1)"
              v-if="hasPermission('export_bylaw') && innerExport && !basicTable"
              class="btn-icon ml-1"
              v-b-tooltip.hover="$t('Global.export')"
              variant="primary"
            >
              <feather-icon icon="LayoutIcon" />
            </b-button>
          </div>
        </b-row>

        <b-row v-if="!!$slots.filter" class="justify-content-start">
          <b-col cols="12" md="12">
            <b-collapse v-model="visible" id="filter">
              <b-overlay :show="apiLink && !lookups[apiLink]">
              <b-row>
                <slot name="filter"></slot>
              </b-row>
              </b-overlay>
            </b-collapse>
          </b-col>
        </b-row>
      </div>

      <b-overlay :show="loading" rounded="sm">
        <div v-if="draggable" id="drag-index">
          <DragTable @drop="Drag">
            <slot name="customTable"> </slot>
          </DragTable>
        </div>
        <div v-else>
          <slot name="customTable"> </slot>
          {{ checkIfNeedDrop() }}
          {{ checkActionBtn() }}
        </div>
      </b-overlay>
      <div v-if="!basicTable && !browse" class="mx-2 mb-2">
        <b-row>
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-start"
          >
            <div class="mx-1">
              <label>{{ $t("Global.Showing") }}</label>
              <v-select
                v-model="perPage"
                :searchable="false"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                :options="perPageOptions"
                :clearable="false"
                class="per-page-selector d-inline-block mx-50"
              />
              <label>{{ $t("Global.entries") }} </label>
              <label class="mx-05"
                >{{ $t("Global.from") }} {{ meta.from + 1 }}
                {{ $t("Global.to") }}
                {{
                  perPage >= meta.of || meta.to >= meta.of
                    ? meta.of.toString().replace(/^0+/, "")
                    : meta.to.toString().replace(/^0+/, "")
                }}
                {{ $t("Global.of") }} {{ meta.of }}
              </label>
            </div>
            <div></div>
          </b-col>

          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-end"
          >
            <b-pagination
              v-if="count"
              :total-rows="count"
              v-model="page"
              :per-page="perPage"
              first-number
              last-number
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon icon="ChevronLeftIcon" size="18" />
              </template>
              <template #next-text>
                <feather-icon icon="ChevronRightIcon" size="18" />
              </template>
            </b-pagination>
          </b-col>
        </b-row>
      </div>
    </b-card>
    <Export
      v-if="show"
      :passedFilters="filter"
      @close="close()"
      :show="show"
      :title="title"
      :bylaw_id="bylaw_id"
      :queryCourse="queryCourse"
      :apiLink="apiLink"
      size="lg"
      :link="link"
    >
      <template #filters_modal>
        <slot name="filters"></slot>
      </template>
    </Export>
  </div>
</template>

<script>
import {
  BCard,
  BForm,
  BInputGroupPrepend,
  BRow,
  BCol,
  BInputGroup,
  BFormGroup,
  BCollapse,
  VBToggle,
  BFormInput,
  BButton,
  BTable,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BPagination,
  BOverlay,
  BCardHeader,
  BCardBody,
} from "bootstrap-vue";
import DragTable from "@/views/components/table/DragTable";
import Export from "@/views/components/common/Export";
import vSelect from "vue-select";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "DataTable",
  components: {
    DragTable,
    Export,
    BCard,
    BRow,
    BCol,
    BOverlay,
    BInputGroup,
    BFormGroup,
    BInputGroupPrepend,
    BForm,
    BCollapse,
    BCardHeader,
    BCardBody,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    vSelect,
  },
  props: {
    link:String,
    exportPermission:String,
    bylaw_id: Number,
    items: [],
    browse: Boolean,
    basicTable: Boolean,
    loading: false,
    total: null,
    importBtn: Boolean,
    order_direction: { default: true, type: [Boolean, String] },
    icon: String,
    filter: {},
    queryCourse: {},
    draggable: { default: false, type: Boolean },
    innerExport: { default: false, type: Boolean },
    name: String,
    title: String,
    allowSearch: {
      type: Boolean,
      default: true,
    },
    allowActions: {
      type: Boolean,
      default: true,
    },
    allowReset: {
      type: Boolean,
      default: true,
    },
    titleFontSize: {
      type: Number,
      default: 0,
    },
    allowFilterWithoutSearch: {
      type: Boolean,
      default: true,
    },
    paramsLoaded: Boolean,
    tabNum: null,
    resetMargin: {
      type: Boolean,
      default: true,
    },
    defaultFilter: {
      type: String,
      default: null,
    },
    apiLink:String,
    dependentProp:String,
  },
  directives: {
    "b-toggle": VBToggle,
  },
  data() {
    return {
      show:false,
      visible: false,
      perPage: 10,
      init: false,
      search: "",
      rerender: true,
      perPageOptions: [10, 25, 50, 100],
      page: 1,
      queryParamsFounded: false,
      paramsLoadedLocal: null,
      getCount:false,
    };
  },
  computed: {
    ...mapGetters({
      terms: "app/terms",
      lookups:'app/stateLookups',
      generalTotal:"app/generalTotal"
    }),
    count(){
      return this.total ? this.total : ""
    },
    meta() {
      return {
        from: this.perPage * (this.page - 1),
        to: Number(this.perPage) * (this.page - 1) + Number(this.perPage),
        of: this.total ? this.total : "",
      };
    },
  },
  watch: {
    $route(from, to) {
      this.Refresh();
    },
    filter: {
      handler() {
        // if(this.apiLink){
          // this.$store.commit('app/SET_GENERAL_TOTAL',{link:this.apiLink,data:null,remove:true})
        // }
        if (this.filter.export == 1) {
          this.Export();
        } else {
          // this.getCount = false;
          this.updateFilterQueryParams(this.filter);
          if (this.tabNum) {
            this.updateTabsFilter({ index: this.tabNum, filter: this.filter });
            this.updateFilterQueryParams({
              tabNum: this.tabNum,
              ...this.getTabFilterData(this.tabNum),
            });
          }
        }
      },
      deep: true,
    },
    "filter.faculty_id": function (newValue,oldValue) {
      if(!this.apiLink) return;
      if(oldValue){
        this.filter.bylaw_id = null;
        this.filter.department_id = null;
      }
      if(!newValue) return;
      let query = { faculty_id: newValue, record: "brief" };
      if(this.dependentProp == 'departments'){
        this.loadDependentLookups("departments", query);
      }else{
        this.loadDependentLookups("bylaws", query);
      }
    },
    "filter.bylaw_id": function (newValue,oldValue) {
      if(!this.apiLink) return;
      if(oldValue){
      this.filter.program_id = null;
      }
      if(!newValue) return;
      let query = { bylaw_id: newValue,record: "brief" };
      this.loadDependentLookups("programs", query);
      if(this.apiLink && (this.apiLink == 'students' || this.apiLink == 'payments')){
        this.loadDependentLookups('levels',query);
      }
    },
    "filter.program_id": function (newValue) {
      if(!this.apiLink) return;
      if(!newValue){
        let query = { bylaw_id: this.filter && this.filter['bylaw_id'],record: "brief" };
        if(this.apiLink && (this.apiLink == 'students'  || this.apiLink == 'payments')){
        this.loadDependentLookups('levels',query);
        }
        return;
      }
      let query = {program_id:newValue,bylaw_id:this.filter && this.filter['bylaw_id'],record:"brief"}
      this.loadDependentLookups('levels',query)
    },
    page(val) {
      this.updateFilterQueryParams({ page: val });
    },
    perPage(val) {
      this.updateFilterQueryParams({ perPage: val });
    },
  },
  beforeMount(){
    if(this.apiLink){
      this.getLookups({link:this.apiLink,query:{lookups:'yes'}})
    }
  },
  async mounted() {
    //To run this function if document state is interactive
    if (!this.defaultFilter) {
        this.initTerm();
        this.setDotBadge();
        this.init = true;
      }else{
        if(this.terms){
          this.initTerm();
          this.setDotBadge();
          this.init = true;
        }
      }
    try {
      this.setPageTabs();
      let myButton = document.querySelector(".CustomBtn .vs__actions");
      if (myButton) {
        // To Remove down arrow in search(in DB) text
        let childrens = myButton.children;
        childrens[1].remove();
      }
      //To Run this code after get Terms from api call in app.vue
      document.onreadystatechange = () => {
        if (document.readyState == "complete") {
          if (!this.init) {
            //  To select curent term value by default and not make two request
            this.initTerm();
          }
          this.setDotBadge();
        }
      };
      //To run this function if document state is interactive
      // if (this.terms) {
      //   this.initTerm();
      //   this.setDotBadge();
      //   this.init = true;
      // }
    } catch (e) {}
  },
  methods: {
    ...mapActions({
      updateTabsFilter: "app/updateTabsFilter",
      updateCurrentTerms: "app/getTerms",
      getLookups: "app/lookupsAction",
    }),
    close() {
      this.show = false;
    },
    initTerm() {
      if (this.defaultFilter && !this.$route.query[this.defaultFilter]) {
        this.filter[this.defaultFilter] =
        this.terms && this.terms[this.getTermWithId(this.defaultFilter)] ? this.terms[this.getTermWithId(this.defaultFilter)] : null;
        this.updateFilterQueryParams(this.filter);
      } else {
        this.Refresh();
      }
    },

    setDotBadge() {
      //To show or hide dot danger badge
      this.paramsLoadedLocal = this.getFilterFromQueryParams(
        this.filter,
        this.page,
        this.perPage
      );
      if (this.paramsLoadedLocal) {
        this.page = this.paramsLoadedLocal.page;
        this.perPage = this.paramsLoadedLocal.perPage;
        this.search = this.paramsLoadedLocal.search;
        this.queryParamsFounded = this.paramsLoadedLocal.filterUpdated;
        this.paramsLoadedLocal = true;
      }
    },
    //To rename prop as in api request to get value of Spacific object
    getTermWithId(termName) {
      let termNameRemovedCurrent = termName.replace("_id", "");
      return "current_" + termNameRemovedCurrent;
    },
    getUrlQuery() {
      let urlQuery = this.$route.query;
      Object.keys(urlQuery).forEach(function (key) {
        if (isNaN(urlQuery[key])) {
          if (key == "tags" || key == "status" || key == 'students_tags') {
            if (Array.isArray(urlQuery[key])) {
              urlQuery[key] = urlQuery[key];
            } else {
              urlQuery[key] = [urlQuery[key]];
            }
          } else {
            urlQuery[key] = urlQuery[key];
          }
        } else {
          if (Array.isArray(urlQuery[key])) {
            urlQuery[key] = urlQuery[key];
          } else {
            urlQuery[key] = Number(urlQuery[key]);
          }
        }
      });
      return urlQuery;
    },
    async Refresh(search = false) {
      if (search) {
        // this.getCount = false;
        this.updateFilterQueryParams({ search: this.search });
        // return;
      }
      //To convert number of props in url from String To Number
      let query = {
        limit: this.perPage,
        offset: search
          ? 0
          : (this.getUrlQuery().page
              ? this.getUrlQuery().page - 1
              : this.page - 1) * this.perPage,
        keywords: this.getUrlQuery().search,
        language: this.$i18n.locale,
        page: this.page,
        order_direction: "DESC",
        ...this.$route.query,
      };
      // if(this.apiLink && this.generalTotal[this.apiLink] && this.getCount){
      //   query = {...query,...{ignore_count:true}}
      // }
      // this.getCount = true;
      //Delete search params
      delete query["search"];
      delete query["tabNum"];
      // to set current pagination page
      // this.$store.commit("app/SET_CURRENT_PAGE", this.page);
      this.$emit("Refresh", query);
    },
    Drag(e) {
      this.$emit("Drag", e);
    },
    reset() {
      this.search = "";
      this.$emit("reset");
      if (!this.$route.query) {
        this.queryParamsFounded = false;
      }
    },
    Export(type = null) {
      let query = {
        ...this.$route.query,
        keywords: this.search,
        records: this.count,
      };
      delete query["export"];
      delete query["removed"];

      if(this.$route.query['admission_term_UG_id']){
        query["admission_term_id"] = this.$route.query['admission_term_UG_id'];
        delete query["admission_term_UG_id"];
      }
      if(this.$route.query['admission_term_PG_id']){
        if(this.$route.name == "applicants_pg"){
          query["admission_term_id"] = this.$route.query['admission_term_PG_id'];
          delete query["admission_term_PG_id"];
        }else if( this.$route.query['admission_term_PG_id']){
          delete query["admission_term_PG_id"];
        }
      }
      if (type) {
        query.is_pdf = type;
        this.$emit("Export", query);
      } else {
        if (this.filter.export == 0) {
          return;
        } else {
          this.$emit("Export", query);
        }
      }
    },
    Search(val) {
      this.$emit("search", this.filter.search_student);
    },
  },
};
</script>

<style scoped>
.badge.badge-up {
  margin-top: -5px;
  margin-right: -7px;
  min-width: 12px;
  min-height: 12px;
}
</style>
