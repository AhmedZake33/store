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
      <b-table
          outlined
          :empty-text="$t('Global.empty_text')"
          show-empty
          :busy="loading"
          :items="items"
          :fields="fieldsData"
          striped
          responsive="sm"
      >
        <template v-if="head" #thead-top="data">
          <b-tr>
            <b-th colspan="1"><span class="sr-only"></span></b-th>
            <b-th colspan="1"><span class="sr-only"></span></b-th>
            <b-th variant="primary" class="text-center" colspan="2">{{
                $t("Global.marks_collected")
              }}
            </b-th>
            <b-th colspan="1"><span class="sr-only"></span></b-th>
          </b-tr>
        </template>
        <template v-if="head_tuition" #thead-top="data">
          <b-tr>
            <b-th colspan="2"><span class="sr-only"></span></b-th>
            <b-th variant="primary" class="text-center" colspan="3">{{
                $t("Global.instalments")
              }}
            </b-th>
            <b-th colspan="1"><span class="sr-only">Name and ID</span></b-th>
          </b-tr>
        </template>
        <template v-if="head_grade" #thead-top="data">
          <b-tr>
            <b-th colspan="1"><span class="sr-only"></span></b-th>
            <b-th
                variant="primary"
                class="text-center border-left border-right"
                colspan="2"
            >{{ $t("Global.ms") }}
            </b-th
            >
            <b-th
                variant="primary"
                class="text-center border-right border-left"
                colspan="2"
            >{{ $t("Global.ss") }}
            </b-th
            >
            <b-th colspan="1"><span class="sr-only"></span></b-th>
            <!--                    <b-th colspan="1"><span class="sr-only">Name and ID</span></b-th>-->
          </b-tr>
        </template>
        <template #table-busy>
          <div class="text-center text-black my-2">
            <b-spinner class="align-middle"/>
          </div>
        </template>
        <template #cell(actions)="data">
          <div>
            <feather-icon
                v-if="data.item.manual == 1"
                v-b-tooltip.hover="$t('Global.edit')"
                icon="EditIcon"
                style="cursor: pointer"
                @click="$emit('update', data.item, table,data.item.id)"
            />
            
            />
  
          </div>
        </template>
        <template #cell(selected)="data">
          <div v-if="rerender">
            <b-form-checkbox
                :disabled="data.item.checked && !data.item.show"
                @change="checkInstallment($event, data.item)"
                v-model="data.item.checked"
                class="custom-control-success"
            ></b-form-checkbox>
          </div>
        </template>
        <template #cell(show_details)="row"  v-if="showDetailsValidation">
          <div class="pointer d-flex" v-if="row.item.programs">
            <feather-icon @click="row.toggleDetails" icon="EyeIcon"/>
          </div>
        </template>
        <template #cell(code)="data">
          <span v-if="data.item.code">
            {{
              data.item.code
            }}
          </span>
          <span v-else>
            {{
              "-"
            }}
          </span>
          
        </template>
        <template #cell(faculty)="data">
          <span v-if="data.item.name">
            {{
               $i18n.locale == "ar" ? data.item.name_local : data.item.name 
            }}
          </span>
          <span v-else>
            {{
              "-"
            }}
          </span>
          
        </template>
        
        
        
        <template #cell(name)="data">
          <span class="font-weight-bold d-block text-nowrap w_fit_content">
            {{ $i18n.locale == "ar" ? data.item.name_local : data.item.name }}
          </span>
        </template>
        <template #cell(total_students)="data">
          
          <span >
            {{
               data.item.graduate!=null ? data.item.graduate : "-" 
            }}
          </span>
        </template>
        <template #row-details="row">
          <b-table
              small
              
              :empty-text="$t('Global.empty_text')"
              show-empty
              :items="row.item.programs"
              :fields="inner"
              striped
              responsive
              
          >
            <template #cell(program)="data">
              <span v-if="data.item.name" class="font-weight-bold d-block text-nowrap w_fit_content">
                {{  $i18n.locale == "ar" ? data.item.name_local : data.item.name  }}
              </span>
              <span v-else>
                {{ data.item.name_local ? data.item.name_local : "-" }}
              </span>
            </template>
           
            <template #cell(studying)="data">
              <span v-if="data.item.pg_students_count">
                {{ data.item.pg_students_count ? data.item.pg_students_count : "-" }}
              </span>
              <span v-else>
                {{ data.item.ug_students_count ? data.item.ug_students_count : "-" }}
              </span>
              
            </template><template #cell(graduated)="data">
              <span>
                {{ data.item.graduate ? data.item.graduate : "-" }}
              </span>
            </template><template #cell(total_students)="data">
              <span>
                {{ data.item.graduate_count ? data.item.graduate_count : "-" }}
              </span>
            </template> 
          
          <template #cell(bylaw)="data">
              <span v-if="data.item.bylaw_name">
                {{  $i18n.locale == "ar" ? data.item.bylaw_nameAr : data.item.bylaw_name  }}
              </span>
              <span v-else>
                {{ data.item.bylaw_nameAr ? data.item.bylaw_nameAr : "-" }}
              </span>
            </template>
          
         
       
            
          </b-table>
         
        </template>
  
        <template #cell(total_grade)="data">
          <span>
            {{
              totalGrades(data.item)
            }}
          </span>
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
      items: null,
      fields: [],
      inner: [],
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
  