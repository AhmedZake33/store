<template>
    <b-card no-body :style="cardStyle">
      <div v-if="title2" class="bg-gray p-1">
        <div class="d-flex justify-content-between">
          <strong
              class="font-medium-3 hour_status"
              :class="customStyle ? 'col-6 remove-padding' : ''"
          >
            {{ title2 }}
            <slot name="status"></slot>
  
          </strong>
          <div>
  
          </div>
          <!--                <div>-->
          <slot name="action"></slot>
          <!--                </div>-->
        </div>
        <!--            <solt></solt>-->
      </div>
      <!--        background-color: #f3f2f7-->
      <b-card-header v-else-if="title" class="text-white p-0 w-100">
        <b-row
            class="mb-1 d-flex justify-content-between w-100 align-items-center"
        >
          <div class="mx-2 my-1">
            <h3 class="m-0" style="padding: 0px 10px">{{ title }}</h3>
            <slot name="paymentTitle"></slot>
          </div>
          <div>
            <slot name="edit"></slot>
            <b-button
                v-if="add && !add_subject"
                class="btn-icon"
                @click="spring ? $emit('add', null, 'SPRING')  : $emit('add', null, 3)"
                v-b-tooltip.hover="$t('Global.add')"
                variant="primary"
            >
              <feather-icon icon="PlusIcon"/>
            </b-button>
            <b-button
                v-if="add_subject"
                class="btn-icon"
                @click="$emit('add', null, 'SUBJECTS')"
                v-b-tooltip.hover="$t('Global.add')"
                variant="primary"
            >
              <feather-icon icon="PlusIcon"/>
            </b-button>
          </div>
        </b-row>
      </b-card-header>
      <b-card-header v-else class="text-white p-0 w-100">
        <b-row
            class="mb-0 d-flex justify-content-between w-100 align-items-center"
        >
          <div class="my-0">
            <slot name="paymentTitle"></slot>
          </div>
          <div>
            <slot name="edit"></slot>
            <b-button
                v-if="add"
                class="btn-icon"
                @click="$emit('add', null, 3)"
                v-b-tooltip.hover="$t('Global.add')"
                variant="primary"
            >
              <feather-icon icon="PlusIcon"/>
            </b-button>
          </div>
        </b-row>
      </b-card-header>
      <b-table show-empty :busy="loading" :items="items" :fields="fieldsData" striped responsive>
        <!-- <template v-if="levels == false"> -->
          <template #thead-top="data" v-if="head">
            
              <b-tr>
                <b-th colspan="10" class="text-center">{{label}}</b-th>
              </b-tr>
              <b-tr>
                <b-th colspan="1"><span class="sr-only"></span></b-th>
                <b-th variant="primary" style="border-right:1px solid #a4a4a4" class="text-center" colspan="4">{{ $t('Global.Financials') }}</b-th>
                <b-th variant="primary" style="border-right:1px solid #a4a4a4" class="text-center" colspan="4">{{ $t('Global.students') }}</b-th>
                <b-th colspan="1"><span class="sr-only"></span></b-th>
              </b-tr>
          </template>
        <template #table-busy>
            <div class="text-center text-black my-2">
                <b-spinner class="align-middle"/>
            </div>
        </template>
        <template #cell(faculty)="data">
            <strong>{{ data.item.faculty }}</strong> 
        </template>
        <template #cell(show_details)="row">
            <div>
                <feather-icon class="text-primary" @click="row.toggleDetails" icon="EyeIcon" />
            </div>
        </template>

        <template #row-details="row">
            <b-table small :empty-text="$t('Global.empty_text')" show-empty :items="row.item.programs"  :fields="innerFieldsData"
              striped responsive>
              <template #thead-top="data" v-if="head">
                <template v-if="levels == false">
                <b-tr>
                    <b-th colspan="1"><span class="sr-only"></span></b-th>
                    <b-th variant="primary" style="border-right:1px solid #a4a4a4" class="text-center" colspan="3">{{ $t('Global.Financials') }}</b-th>
                    <b-th variant="primary" style="border-right:1px solid #a4a4a4" class="text-center" colspan="4">{{ $t('Global.students') }}</b-th>
                    <b-th colspan="1"><span class="sr-only"></span></b-th>
                </b-tr>
              </template>
              <template v-if="levels == true">
                <b-tr>
                    <b-th colspan="1"><span class="sr-only"></span></b-th>
                    <b-th variant="primary" style="border-right:1px solid #a4a4a4" class="text-center" colspan="3">{{ $t('Global.Financials') }}</b-th>
                    <b-th variant="primary" style="border-right:1px solid #a4a4a4" class="text-center" colspan="10">{{ $t('Global.students') }}</b-th>
                    <b-th colspan="1"><span class="sr-only"></span></b-th>
                </b-tr>
              </template>
            </template>
              <template #cell(programs)="data">
                <strong>{{ $i18n.locale == 'en'? data.item.program_name:data.item.program_name_local }}</strong> 
            </template>
    
    
            </b-table>
    
          </template>


    </b-table>
    </b-card>
  </template>
  
  <script>
  import {
    BTable,
    BOverlay,
    BFormCheckboxGroup,
    BFormCheckbox,
    BButton,
    BCard,
    BRow,
    BCol,
    BAvatar,
    BBadge,
    BLink,
    BSpinner,
    BTr,
    BCardHeader,
    BTh,
  } from "bootstrap-vue";
  import BCardActions from "@core/components/b-card-actions/BCardActions.vue";
  import AppCollapse from "@core/components/app-collapse/AppCollapse.vue";
  import AppCollapseItem from "@core/components/app-collapse/AppCollapseItem.vue";
  import {mapActions} from "vuex";
  import {getAuth} from "@/auth/utils";
  
  export default {
    components: {
      BTr,
      BTh,
      BCardHeader,
      BTable,
      BLink,
      BButton,
      BCard,
      BSpinner,
      BRow,
      BCol,
      BBadge,
      BAvatar,
      BFormCheckbox,
      BFormCheckboxGroup,
      BCardActions,
      AppCollapse,
      AppCollapseItem,
      BOverlay,
    },
    props: {
      label:'',
      items: null,
      program:null,
      fields: [],
      inner: [],
      levels:false,
      add_subject: Boolean,
      add: Boolean,
      title: String,
      title2: String,
      spring: Boolean,
      type: String,
      loading: false,
      noDetails: Boolean,
      head: Boolean,
      add_option: Boolean,
      table: {default: 3, type: Number},
      head_tuition: Boolean,
      head_grade: Boolean,
      settings: Boolean,
      remove_grades: Boolean,
      is_pg: Boolean,
      status: Object,
      studentAccount: {default: false, type: Boolean},
      showDetailsValidation: {default: true, type: Boolean},
      cardStyle: {
        type: String,
        default: "",
      },
      customStyle: {
        default: false,
        type: Boolean,
        controlView: {default: false, type: Boolean},
        editMode: {default: false, type: Boolean},
      },
    },
    data() {
      return {
        selected: [],
        rerender: true
      };
    },
    computed: {
      fieldsData() {
        let data = [
          ...this.fields,
          {
            key: "show_details",
            thClass: "customAction text-center",
            tdClass: "customDetailsWidth ",
            label: this.$i18n.locale === "en" ? "Show Details" : "رؤية التفاصيل",
          },
        ];
        if (this.noDetails) {
          data = data.filter((obj) => !["show_details"].includes(obj.key));
        }
  
        return data;
      },
      innerFieldsData() {
        let data = [
          ...this.inner,
          {
            key: "show_details",
            thClass: "customAction text-center",
            tdClass: "customDetailsWidth ",
            label: this.$i18n.locale === "en" ? "" : "",
          },
        ];
        if (this.noDetails) {
          data = data.filter((obj) => !["show_details"].includes(obj.key));
        }
  
        return data;
      },
    },
    mounted() {
      
    },
    methods: {
      
      checkInstallment(event, data) {
        this.$emit("getCheck", [event, data]);
        this.rerender = false;
        setTimeout((_) => {
          this.rerender = true;
        }, 2);
      },
     
    },
  };
  </script>
  
  <style scoped lang="scss">
  .remove-padding {
    padding-left: 0;
    padding-right: 0;
  }
  
  .hour_status {
    span {
      padding: 0rem 0.6rem;
      padding-bottom: 0.2rem;
    }
  }
  
  .w_fit_content {
    width: fit-content;
  }
  </style>
  