<template>
    <b-card no-body :style="cardStyle">
      <!-- <b-table
          outlined
          :empty-text="$t('Global.empty_text')"
          show-empty
          :busy="loading"
          :items="items"
          :fields="fieldsData"
          striped
          responsive="sm"
      >

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
        <template #cell(percentage)="data">
          <span v-if="data.item.percentage">
            {{
              data.item.percentage
            }}%
          </span>
          <span v-else>
              0.0%
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
              :items="row.item.grade_name"
              :fields="inner"
              striped
              responsive
              
          >
            <template #cell(grade_name)="data">
              <span v-if="data.item.name" class="font-weight-bold d-block text-nowrap w_fit_content">
                {{  $i18n.locale == "ar" ? data.item.name_local : data.item.name  }}
              </span>
              <span v-else>
                {{ data.item.grade_name ? data.item.grade_name : "-" }}
              </span>
            </template>
           
            <template #cell(percentage)="data">
              <span v-if="data.item.percentage">
                {{ data.item.percentage }}%
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

      </b-table> -->
      <div>
    <b-table-simple
      hover
      small
      caption-top
      responsive
    >
      <b-thead head-variant="light">
        <b-tr>
          <b-th>{{ $t("Global.grade") }}</b-th>
          <b-th>{{ $t("number of students") }}</b-th>
          <b-th>{{ $t("Global.percentage") }}</b-th>
          <b-th>{{ $t("Global.grouped grades") }}</b-th>
          <b-th>{{ $t("Global.grouped percentage") }}</b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <template v-for="(group) in items">
        <b-tr v-for="(item, nestedIndex) of group['grade_name']" :key="nestedIndex">
          
          <b-td>{{item.grade_name}}</b-td>
          <b-td>{{item.student_count}}</b-td>
          <b-td>{{item.percentage}}</b-td>
          <b-td v-if="(nestedIndex == 0)" :rowspan="group.count">{{group.student_count}}</b-td>
          <b-td v-if="(nestedIndex == 0)" :rowspan="group.count">{{group.percentage}}</b-td>

        </b-tr>
      </template>
      </b-tbody>
    </b-table-simple>
  </div>
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
    BTd,
    BTbody,
    BThead,
    BTableSimple,
    BCardHeader,
    TableSimplePlugin,
    BTh,
  } from "bootstrap-vue";
  import BCardActions from "@core/components/b-card-actions/BCardActions.vue";
  import AppCollapse from "@core/components/app-collapse/AppCollapse.vue";
  import AppCollapseItem from "@core/components/app-collapse/AppCollapseItem.vue";
  import {mapActions} from "vuex";
  import {getAuth} from "@/auth/utils";
  
  export default {
    components: {
      BTableSimple,
      BTbody,
      BThead,
      BTd,
      TableSimplePlugin,
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
        rerender: true,
        entered: false,
      };
    },
    computed: {
      fieldsData() {
        let data = [
          ...this.fields
        ];
  
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

      setEntered(value){
        this.entered = value;
      }
     
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
  