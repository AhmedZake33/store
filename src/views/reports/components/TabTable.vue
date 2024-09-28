<template>
  <b-card no-body :style="cardStyle">
    <div v-if="title2" class="bg-gray p-1">
      <div class="d-flex justify-content-between">
        <strong class="font-medium-3 hour_status" :class="customStyle ? 'col-6 remove-padding' : ''">
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
      <b-row class="mb-1 d-flex justify-content-between w-100 align-items-center">
        <div class="mx-2 my-1">
          <h3 class="m-0" style="padding: 0px 10px">{{ title }}</h3>
          <slot name="paymentTitle"></slot>
        </div>
        <div>
          <slot name="edit"></slot>
          <b-button v-if="add && !add_subject" class="btn-icon"
            @click="spring ? $emit('add', null, 'SPRING')  : $emit('add', null, 3)" v-b-tooltip.hover="$t('Global.add')"
            variant="primary">
            <feather-icon icon="PlusIcon" />
          </b-button>
          <b-button v-if="add_subject" class="btn-icon" @click="$emit('add', null, 'SUBJECTS')"
            v-b-tooltip.hover="$t('Global.add')" variant="primary">
            <feather-icon icon="PlusIcon" />
          </b-button>
        </div>
      </b-row>
    </b-card-header>
    <b-card-header v-else class="text-white p-0 w-100">
      <b-row class="mb-0 d-flex justify-content-between w-100 align-items-center">
        <div class="my-0">
          <slot name="paymentTitle"></slot>
        </div>
        <div>
          <slot name="edit"></slot>
          <b-button v-if="add" class="btn-icon" @click="$emit('add', null, 3)" v-b-tooltip.hover="$t('Global.add')"
            variant="primary">
            <feather-icon icon="PlusIcon" />
          </b-button>
        </div>
      </b-row>
    </b-card-header>
    <b-table outlined :empty-text="$t('Global.empty_text')" show-empty :busy="loading" :items="items"
      :fields="fieldsData" striped responsive="responsive" foot-clone>
      <template #thead-top="data" v-if="students">
        <b-tr>
          <th colspan="1" ><span class="sr-only"></span></th>
          <th colspan="6" class="text-center border-1">{{ $t('Global.level') }}</th>
          <th colspan="6" class="text-center border-1">{{ $t('Global.year') }}</th>
          <th colspan="6"><span class="sr-only"></span></th>
        </b-tr>
      </template>
      <template #table-busy>
        <div class="text-center text-black my-2">
          <b-spinner class="align-middle" />
        </div>
      </template>
      <template #cell(actions)="data">
        <div>
          <feather-icon v-if="data.item.manual == 1" v-b-tooltip.hover="$t('Global.edit')" icon="EditIcon"
            style="cursor: pointer" @click="$emit('update', data.item, table,data.item.id)" />
          <feather-icon v-b-tooltip.hover="$t('Global.delete')" v-if="settings" icon="Trash2Icon"
            style="cursor: pointer" class="text-capitalize" @click="$emit('remove', data.item.id)" />
          <feather-icon v-b-tooltip.hover="$t('Global.delete')" v-else-if="!remove_grades" icon="Trash2Icon"
            style="cursor: pointer" class="text-capitalize" @click="remove(data.item.id)" />

          <feather-icon v-b-tooltip.hover="$t('Global.add')" v-if="add_option" icon="PlusCircleIcon"
            style="cursor: pointer" class="text-primary" @click="$emit('add', data.item.id)" />

          <feather-icon v-b-tooltip.hover="$t('Global.delete')" v-if="remove_grades" icon="Trash2Icon"
            style="cursor: pointer" class="text-capitalize" @click="$emit('minus_grades', data.item.id)" />
        </div>
      </template>
      <template #cell(selected)="data">
        <div v-if="rerender">
          <b-form-checkbox :disabled="data.item.checked && !data.item.show"
            @change="checkInstallment($event, data.item)" v-model="data.item.checked" class="custom-control-success">
          </b-form-checkbox>
        </div>
      </template>
      <template #cell(show_details)="row" v-if="showDetailsValidation">
        <div class="pointer d-flex">
          <feather-icon class="text-primary" @click="row.toggleDetails" icon="EyeIcon" />
          <!--  <feather-icon
              v-b-tooltip.hover="$t('Global.add')"
              
              icon="PlusCircleIcon"
              style="cursor: pointer"
              class="text-primary"
              @click="$emit('addCourseOnTerm',data.item)"
          /> -->
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

      <template #cell(level1)="data">
        <span>
          {{ data.item.level1 ? data.item.level1 : "-" }}
        </span>
      </template>
      <template #cell(level2)="data">
        <span>
          {{ data.item.level2 ? data.item.level2 : "-" }}
        </span>
      </template>
      <template #cell(level3)="data">
        <span>
          {{ data.item.level3 ? data.item.level3 : "-" }}
        </span>
      </template>
      <template #cell(level4)="data">
        <span>
          {{ data.item.level4 ?data.item.level4 : "-" }}
        </span>
      </template>
      <template #cell(level5)="data">
        <span>
          {{ data.item.level5 ? data.item.level5 :  "-" }}
        </span>
      </template>
      <template #cell(level6)="data">
        <span>
          {{ data.item.level6 ? data.item.level6 : "-" }}
        </span>
      </template>
      <template #cell(year1)="data">
        <span>
          {{ data.item.year1 ? data.item.year1 : '-'}}
        </span>
      </template>
      <template #cell(year2)="data">
        <span>
          {{ data.item.year2 ?  data.item.year2 : '-' }}
        </span>
      </template>
      <template #cell(year3)="data">
        <span>
          {{ data.item.year3 ? data.item.year3 : '-' }}
        </span>
      </template>
      <template #cell(year4)="data">
        <span>
          {{ data.item.year4 ? data.item.year4 : '-'}}
        </span>
      </template>
      <template #cell(year5)="data">
        <span>
          {{ data.item.year5 ? data.item.year5 : '-' }}
        </span>
      </template>
      <template #cell(year6)="data">
        <span>
          {{ data.item.year6 ? data.item.year6 : '-' }}
        </span>
      </template>
      <template #cell(egyptians)="data">
        <span>
          {{ data.item.egyptians ? data.item.egyptians : '-' }}
        </span>
      </template>
      <template #cell(foreigners)="data">
        <span>
          {{ data.item.foreigners ? data.item.foreigners : '-'  }}
        </span>
      </template>
      <template #cell(nolevel)="data">
        <span>
          {{ data.item.nolevel ?  data.item.nolevel : '-' }}
        </span>
      </template>
      <template #cell(notset)="data">
        <span>
          {{ data.item.notset ?  data.item.notset : '-' }}
        </span>
      </template>
      <!-- <template #cell(foreigners)="data">
        <span>
          {{ data.item.foreigners ? (data.item.foreigners + data.item.notset) : data.item.notset }}
        </span>
      </template> -->

      <template #cell(total_students)="data">

        <span>
          {{
            data.item.total_students ? data.item.total_students : '-'
          }}
        </span>
      </template>
      <template #cell(term_name)="data">
        <b-link v-if="$i18n.locale == 'en'" @click="data.toggleDetails"
          class="font-weight-bold d-block text-nowrap w_fit_content">
          {{ data.item.name ? data.item.name : "-" }}
        </b-link>
        <span v-if="$i18n.locale == 'ar'">
          {{ data.item.name_local ? data.item.name_local : "-" }}
        </span>
      </template>
      <template #cell(year)="data">
        <span>
          {{ data.item.year ? data.item.year : "-" }}
        </span>
      </template>
      <template #cell(grade_level)="data">
        <span>
          {{
            $i18n.locale == "en"
                ? data.item.level_name
                : data.item.level_name_local
          }}
        </span>
      </template>



      <template #row-details="row">
        <b-table small :empty-text="$t('Global.empty_text')" show-empty :items="row.item.programs" :fields="inner"
          striped responsive="responsive">
          <template #thead-top="data" v-if="students">
        <b-tr>
          <th colspan="1" ><span class="sr-only"></span></th>
          <th colspan="1" ><span class="sr-only"></span></th>
          <th colspan="6" class="text-center border-1">{{ $t('Global.level') }}</th>
          <th colspan="6" class="text-center border-1">{{ $t('Global.year') }}</th>
          <th colspan="6"><span class="sr-only"></span></th>
        </b-tr>
      </template>
          <template #cell(program)="data">
            <span v-if="data.item.name" class="font-weight-bold d-block text-nowrap w_fit_content">
              {{  $i18n.locale == "ar" ? data.item.name_local : data.item.name  }}
            </span>
            <span v-else>
              {{ data.item.name_local ? data.item.name_local : "-" }}
            </span>
          </template>
          <template #cell(bylaw)="data">
            <span v-if="$i18n.locale == 'ar'">
              {{   data.item.bylaw.name_local  }}
            </span>
            <span v-else>
              {{   data.item.bylaw.name  }}
            </span>
          </template>

          <!-- <template #cell(studying)="data">
            <span v-if="data.item.pg_students_count">
              {{ data.item.pg_students_count ? data.item.pg_students_count : "-" }}
            </span>
            <span v-else>
              {{ data.item.ug_students_count ? data.item.ug_students_count : "-" }}
            </span>

          </template>
          <template #cell(graduated)="data">
            <span>
              {{ data.item.graduated_students_count ? data.item.graduated_students_count : "-" }}
            </span>
          </template> -->
         <!--  <template #cell(total_students)="data">
            <span>
              {{ data.item.students_count }}
            </span>
          </template> -->
          <template #cell(l1)="data">
            <span>
              {{ data.item.levels[0].level1 ? data.item.levels[0].level1 : '-'}}
            </span>
          </template>
          <template #cell(l2)="data">
            <span>
              {{ data.item.levels[0].level2 ?  data.item.levels[0].level2 : '-' }}
            </span>
          </template>
          <template #cell(l3)="data">
            <span>
              {{ data.item.levels[0].level3 ? data.item.levels[0].level3 : '-' }}
            </span>
          </template>
          <template #cell(l4)="data">
            <span>
              {{ data.item.levels[0].level4 ? data.item.levels[0].level4 : '-'}}
            </span>
          </template>
          <template #cell(l5)="data">
            <span>
              {{ data.item.levels[0].level5 ? data.item.levels[0].level5 : '-' }}
            </span>
          </template>
          <template #cell(l6)="data">
            <span>
              {{ data.item.levels[0].level6 ? data.item.levels[0].level6 : '-' }}
            </span>
          </template>

          <template #cell(y1)="data">
            <span>
              {{ data.item.levels[0].year1 ? data.item.levels[0].year1 : '-'}}
            </span>
          </template>
          <template #cell(y2)="data">
            <span>
              {{ data.item.levels[0].year2 ?  data.item.levels[0].year2 : '-' }}
            </span>
          </template>
          <template #cell(y3)="data">
            <span>
              {{ data.item.levels[0].year3 ? data.item.levels[0].year3 : '-' }}
            </span>
          </template>
          <template #cell(y4)="data">
            <span>
              {{ data.item.levels[0].year4 ? data.item.levels[0].year4 : '-'}}
            </span>
          </template>
          <template #cell(y5)="data">
            <span>
              {{ data.item.levels[0].year5 ? data.item.levels[0].year5 : '-' }}
            </span>
          </template>
          <template #cell(y6)="data">
            <span>
              {{ data.item.levels[0].year6 ? data.item.levels[0].year6 : '-' }}
            </span>
          </template>
          <template #cell(total_students)="data">
            <span v-if="data.item.levels[0].pg_students_count">
              {{ data.item.levels[0].pg_students_count ? data.item.levels[0].pg_students_count : "-" }}
            </span>
            <span v-else>
              {{ data.item.levels[0].ug_students_count ? data.item.levels[0].ug_students_count : "-" }}
            </span>

          </template>
          <template #cell(graduated)="data">
            <span>
              {{ data.item.levels[0].graduated_students_count ? data.item.levels[0].graduated_students_count : "-" }}
            </span>
          </template>
          <template #cell(egyptians)="data">
        <span>
          {{ data.item.levels[0].egyptians ? data.item.levels[0].egyptians : '-' }}
        </span>
      </template>
      <template #cell(foreigners)="data">
        <span>
          {{ data.item.levels[0].foreigners ? data.item.levels[0].foreigners : '-'  }}
        </span>
      </template>
      <template #cell(nolevel)="data">
        <span>
          {{ data.item.levels[0].nolevel ?  data.item.levels[0].nolevel : '-' }}
        </span>
      </template>
      <template #cell(notset)="data">
        <span>
          {{ data.item.levels[0].notset ?  data.item.levels[0].notset : '-' }}
        </span>
      </template>


        </b-table>

      </template>

      <template #foot(faculty)>
        <span class="text-capitalize">{{$t('Global.total')}}</span>
      </template>
      <template #foot(level1)>
        <span class="text-capitalize">{{ total.level1 }}</span>
      </template>
      <template #foot(level2)>
        <span class="text-capitalize">{{ total.level2 }}</span>
      </template> <template #foot(level3)>
        <span class="text-capitalize">{{ total.level3 }}</span>
      </template> <template #foot(level4)>
        <span class="text-capitalize">{{ total.level4 }}</span>
      </template> <template #foot(level5)>
        <span class="text-capitalize">{{ total.level5 }}</span>
      </template>
      <template #foot(level6)>
        <span class="text-capitalize">{{ total.level6 }}</span>
      </template> <template #foot(year1)>
        <span class="text-capitalize">{{ total.year1 }}</span>
      </template>
      <template #foot(year2)>
        <span class="text-capitalize">{{ total.year2 }}</span>
      </template><template #foot(year3)>
        <span class="text-capitalize">{{ total.year3 }}</span>
      </template><template #foot(year4)>
        <span class="text-capitalize">{{ total.year4 }}</span>
      </template><template #foot(year5)>
        <span class="text-capitalize">{{ total.year5 }}</span>
      </template><template #foot(year6)>
        <span class="text-capitalize">{{ total.year6 }}</span>
      </template>
      <template #foot(egyptians)>
        <span class="text-capitalize">{{ (total.egyptians ) }}</span>
      </template>
      <template #foot(foreigners)>
        <span class="text-capitalize">{{ (total.foreigners ) }}</span>
      </template>
      <template #foot(nolevel)>
        <span class="text-capitalize">{{ ( total.nolevel) }}</span>
      </template>
      <template #foot(notset)>
        <span class="text-capitalize">{{ ( total.notset) }}</span>
      </template>
      <!-- <template #foot(foreigners)>
        <span class="text-capitalize">{{ (total.foreigners + total.notset) }}</span>
      </template> --><template #foot(total_students)>
        <span class="text-capitalize">{{ total.total_students  }}</span>
      </template>
      <!-- Default fall-back custom formatted footer cell -->
      <template #foot()>
        <span></span>
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
  import {
    mapActions
  } from "vuex";
  import {
    getAuth
  } from "@/auth/utils";

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
      total: [],
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
      table: {
        default: 3,
        type: Number
      },
      head_tuition: Boolean,
      head_grade: Boolean,
      settings: Boolean,
      remove_grades: Boolean,
      is_pg: Boolean,
      status: Object,
      students:Boolean,
      studentAccount: {
        default: false,
        type: Boolean
      },
      showDetailsValidation: {
        default: true,
        type: Boolean
      },
      cardStyle: {
        type: String,
        default: "",
      },
      customStyle: {
        default: false,
        type: Boolean,
        controlView: {
          default: false,
          type: Boolean
        },
        editMode: {
          default: false,
          type: Boolean
        },
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

<style lang="scss">
.border-1{
  border: 1px solid #ddd;
}  
</style>

</style>

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