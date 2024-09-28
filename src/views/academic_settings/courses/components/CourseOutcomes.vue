<template>
  <b-card no-body :style="cardStyle">
    <div v-if="title2" class="bg-gray p-1">
      <div class="d-flex justify-content-between">
        <strong
          class="font-medium-3"
          :class="customStyle ? 'col-6 remove-padding' : ''"
        >
          {{ title2 }}
        </strong>
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
            v-if="add"
            class="btn-icon"
            @click="$emit('add', null, 3)"
            v-b-tooltip.hover="$t('Global.add')"
            variant="primary"
          >
            <feather-icon icon="PlusIcon" />
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
            <feather-icon icon="PlusIcon" />
          </b-button>
        </div>
      </b-row>
    </b-card-header>
    <b-table
      outlined
      :empty-text="getLoadText(loading)"
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
          }}</b-th>
          <b-th colspan="1"><span class="sr-only"></span></b-th>
        </b-tr>
      </template>
      <template v-if="head_tuition" #thead-top="data">
        <b-tr>
          <b-th colspan="2"><span class="sr-only"></span></b-th>
          <b-th variant="primary" class="text-center" colspan="3">{{
            $t("Global.instalments")
          }}</b-th>
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
            >{{ $t("Global.ms") }}</b-th
          >
          <b-th
            variant="primary"
            class="text-center border-right border-left"
            colspan="2"
            >{{ $t("Global.ss") }}</b-th
          >
          <b-th colspan="1"><span class="sr-only"></span></b-th>
          <!--                    <b-th colspan="1"><span class="sr-only">Name and ID</span></b-th>-->
        </b-tr>
      </template>
      <template #table-busy>
        <div class="text-center text-black my-2">
          <b-spinner class="align-middle" />
        </div>
      </template>
      <template #cell(actions)="data">
        <div>
          <feather-icon
            v-b-tooltip.hover="$t('Global.edit')"
            icon="EditIcon"
            style="cursor: pointer"
            @click="$emit('update', data.item, table)"
          />
          <feather-icon
            v-b-tooltip.hover="$t('Global.delete')"
            v-if="settings"
            icon="Trash2Icon"
            style="cursor: pointer"
            class="text-danger"
            @click="$emit('remove', data.item.id)"
          />
          <feather-icon
            v-b-tooltip.hover="$t('Global.delete')"
            v-else-if="!remove_grades"
            icon="Trash2Icon"
            style="cursor: pointer"
            class="text-danger"
            @click="remove(data.item.id)"
          />

          <feather-icon
            v-b-tooltip.hover="$t('Global.add')"
            v-if="add_option"
            icon="PlusCircleIcon"
            style="cursor: pointer"
            class="text-primary"
            @click="$emit('add', data.item.id)"
          />

          <feather-icon
            v-b-tooltip.hover="$t('Global.delete')"
            v-if="remove_grades"
            icon="Trash2Icon"
            style="cursor: pointer"
            class="text-danger"
            @click="$emit('minus_grades', data.item.id)"
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
      <template #cell(show_details)="row" v-if="showDetailsValidation">
        <div class="pointer d-flex" @click="row.toggleDetails">
          <feather-icon icon="EyeIcon" />
        </div>
      </template>
      <template #cell(currency)="data">
        <span v-if="data.item.currency">
          {{
            $i18n.locale == "ar"
              ? data.item.currency.name_local
              : data.item.currency.name
          }}
        </span>
      </template>
      <template #cell(label)="data">
        <span>
          {{ $t(`Global.${data.item.label}`) }}
        </span>
      </template>
      <template #cell(level_name)="data">
        <span>
          {{ $i18n.locale == "ar" ? data.item.name_local : data.item.name }}
        </span>
      </template>
      <template #cell(start_date)="data">
        <b-link class="font-weight-bold d-block text-nowrap">
          {{ data.item.start_date ? data.item.start_date : "-" }}
        </b-link>
      </template>
      <template #cell(status)="data">
        <b-badge
          v-if="data.item.status && typeof data.item.status == 'object'"
          active
          pill
          :variant="`light-primary`"
        >
          {{
            $i18n.locale == "ar"
              ? data.item.status.name_local
              : data.item.status.name
          }}
        </b-badge>
        <b-badge
          v-else-if="data.item.status"
          active
          pill
          :variant="`light-primary`"
        >
          {{ data.item.status }}
        </b-badge>
      </template>
      <template #cell(due_date)="data">
        <div v-if="data.item.due_date">
          {{ toLocalDatetime(data.item.due_date, $i18n.locale, true, false) }}
        </div>
      </template>
      <template #cell(grade_term)="data">
        <b-link
          v-if="$i18n.locale == 'en'"
          class="font-weight-bold d-block text-nowrap"
        >
          {{ data.item.grade_term ? data.item.grade_term.term.name : "-" }}
        </b-link>
        <span v-if="$i18n.locale == 'ar'">
          {{
            data.item.grade_term ? data.item.grade_term.term.name_local : "-"
          }}
        </span>
      </template>
      <template #cell(term_name)="data">
        <b-link
          v-if="$i18n.locale == 'en'"
          @click="data.toggleDetails"
          class="font-weight-bold d-block text-nowrap"
        >
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
      <template #cell(faculty)="data">
        <span v-if="$i18n.locale == 'en'">
          {{ data.item.faculty ? data.item.faculty.name : "-" }}
        </span>
        <span v-if="$i18n.locale == 'ar'">
          {{ data.item.faculty ? data.item.faculty.name_local : "-" }}
        </span>
      </template>
      <template #cell(bylaw)="data">
        <span v-if="$i18n.locale == 'en'">
          {{ data.item.bylaw ? data.item.bylaw.name : "-" }}
        </span>
        <span v-if="$i18n.locale == 'ar'">
          {{ data.item.bylaw ? data.item.bylaw.name_local : "-" }}
        </span>
      </template>
      <template #cell(registration)="data">
        <strong>{{ $t("From") }} </strong>
        {{ data.item.value ? data.item.value.registration_date_from : "-"
        }}<br />
        <strong>&nbsp;&nbsp;{{ $t("To") }}&nbsp;&nbsp;&nbsp; </strong>
        {{ data.item.value ? data.item.value.registration_date_to : "-" }}
      </template>
      <template #cell(add_drop)="data">
        <strong>{{ $t("From") }} </strong>
        {{ data.item.value ? data.item.value.adddrop_date_from : "-" }}<br />
        <strong>&nbsp;&nbsp;{{ $t("To") }}&nbsp;&nbsp;&nbsp; </strong>
        {{ data.item.value ? data.item.value.adddrop_date_to : "-" }}
      </template>
      <template #cell(withdraw)="data">
        <strong>{{ $t("From") }} </strong>
        {{ data.item.value ? data.item.value.withdraw_date_from : "-" }}<br />
        <strong>&nbsp;&nbsp;{{ $t("To") }}&nbsp;&nbsp;&nbsp; </strong>
        {{ data.item.value ? data.item.value.withdraw_date_to : "-" }}
      </template>
      <template #cell(drop)="data">
        <strong>{{ $t("From") }} </strong>
        {{ data.item.value ? data.item.value.drop_date_from : "-" }}<br />
        <strong>&nbsp;&nbsp;{{ $t("To") }}&nbsp;&nbsp;&nbsp; </strong>
        {{ data.item.value ? data.item.value.drop_date_to : "-" }}
      </template>
      <template #cell(program)="data">
        <span v-if="$i18n.locale == 'en'">
          {{ data.item.program ? data.item.program.name : "-" }}
        </span>
        <span v-if="$i18n.locale == 'ar'">
          {{ data.item.program ? data.item.program.name_local : "-" }}
        </span>
      </template>
      <template #cell(label_range)="data">
        <strong>
          {{ data.item.min_gpa }} <= {{ $t("Global.gps") }} <=
          {{ data.item.max_gpa }}
        </strong>
      </template>
      <template #cell(programs)="data">
        <div v-for="program in data.item.programs">
          {{ $i18n.locale == "ar" ? program.name_local : program.name }}
          <strong class="text-danger">,</strong>
        </div>
      </template>
      <template #cell(minimum_grade)="data">
        <span>
          {{ data.item.data ? data.item.data.minimum_grade : "-" }}
        </span>
      </template>
      <template #cell(prev_minimum_grade)="data">
        <span>
          {{ data.item.data ? data.item.data.prev_minimum_grade : "-" }}
        </span>
      </template>
      <template #cell(stem_minimum_grade)="data">
        <span>
          {{ data.item.data ? data.item.data.stem_minimum_grade : "-" }}
        </span>
      </template>
      <template #cell(first_instalment)="data">
        <span>
          {{
            data.item.data
              ? numberWithCommas(data.item.data.first_instalment)
              : "-"
          }}
        </span>
      </template>
      <template #cell(second_instalment)="data">
        <span>
          {{
            data.item.data
              ? numberWithCommas(data.item.data.second_instalment)
              : "-"
          }}
        </span>
      </template>
      <template #cell(total)="data">
        <span>
          {{ data.item.data ? numberWithCommas(data.item.data.total) : "-" }}
        </span>
      </template>
      <template #cell(total_gpa)="data">
        <span>
          {{ data.item.total ? data.item.total : "-" }}
        </span>
      </template>
      <template #cell(first_usd_instalment)="data">
        <span>
          {{
            data.item.data
              ? numberWithCommas(data.item.data.first_usd_instalment)
              : "-"
          }}
        </span>
      </template>
      <template #cell(second_usd_instalment)="data">
        <span>
          {{
            data.item.data
              ? numberWithCommas(data.item.data.second_usd_instalment)
              : "-"
          }}
        </span>
      </template>
      <template #cell(total_usd)="data">
        <span>
          {{
            data.item.data ? numberWithCommas(data.item.data.total_usd) : "-"
          }}
        </span>
      </template>
      <template #cell(admission_exam)="data">
        <span>
          {{
            data.item.data
              ? numberWithCommas(data.item.data.admission_exam)
              : "-"
          }}
        </span>
      </template>
      <template #cell(training_course)="data">
        <span>
          {{
            data.item.data
              ? numberWithCommas(data.item.data.training_course)
              : "-"
          }}
        </span>
      </template>
      <template #cell(quota)="data">
        <span>
          {{ data.item.data ? data.item.data.quota : "-" }}
        </span>
      </template>
      <template #row-details="row">
        <b-table
          small
          v-if="row.item.courses"
          :empty-text="$t('Global.empty_text')"
          show-empty
          :items="row.item.courses"
          :fields="inner ? inner : gradeYearsFields"
          striped
          responsive
        >
          <template #cell(code)="data">
            <span class="font-weight-bold d-block text-nowrap">
              {{ data.item.course ? data.item.course.code : "-" }}
            </span>
          </template>
          <!--                    <template #cell(status)="data">-->
          <!--                        <b-link v-for="(stat, i) in data.item.status" :key="i"-->
          <!--                                class="font-weight-bold d-flex text-nowrap"> {{ stat }},-->
          <!--                        </b-link>-->
          <!--                    </template>-->
          <template #cell(marks)="data">
            <b-link
              v-for="(mark, i) in data.item.marks"
              :key="i"
              class="font-weight-bold d-flex text-nowrap"
            >
              {{
                mark.mark
                  ? `${mark.mark.name}
                            (${mark.value})`
                  : ""
              }},
            </b-link>
          </template>
          <template #cell(grade_type)="data">
            <span
              v-if="$i18n.locale == 'en'"
              class="font-weight-bold d-block text-nowrap"
            >
              {{ data.item.grade_type ? data.item.grade_type.name : "-" }}
            </span>
            <span v-if="$i18n.locale == 'ar'">
              {{
                data.item.grade_type && $i18n.locale == "ar"
                  ? data.item.grade_type.name_local
                  : "-"
              }}
            </span>
          </template>
          <template #cell(term)="data">
            <b-link
              v-if="$i18n.locale == 'en'"
              class="font-weight-bold d-block text-nowrap"
            >
              {{ data.item.term ? data.item.term.name : "-" }}
            </b-link>
            <span v-if="$i18n.locale == 'ar'">
              {{
                data.item.term && $i18n.locale == "ar"
                  ? data.item.term.name_local
                  : "-"
              }}
            </span>
          </template>
          <template #cell(course)="data">
            <b-link
              :to="{ name: 'course', params: { id: data.item.course.id } }"
              v-if="$i18n.locale == 'en'"
              class="font-weight-bold d-block text-nowrap"
            >
              {{ data.item.course ? data.item.course.name : "-" }}
            </b-link>
            <span v-if="$i18n.locale == 'ar'">
              {{
                data.item.course && $i18n.locale == "ar"
                  ? data.item.course.name_local
                  : "-"
              }}
            </span>
          </template>
          <template #cell(details)="data">
            <span v-if="data.item.details">
              {{ data.item.details }}
            </span>
            <span v-else> Helllo </span>
          </template>
          <!-- <template #cell(max_summer_ch_value)="data">
                     <span>
                              {{ data.item.course.credit_hours }}
                     </span>
                    </template> -->
          <template #cell(total_max_total)="data">
            <span> {{ data.item.total }} / {{ data.item.max_total }} </span>
          </template>
          <template #cell(credit_points)="data">
            <span>
              {{ data.item.credit_point }}
            </span>
          </template>
        </b-table>
        <b-table
          class="layout-separator"
          v-else-if="row.item.details"
          :empty-text="$t('Global.empty_text')"
          show-empty
          :head-variant="null"
          :items="row.item.details"
          :fields="inner ? inner : gradeYearsFields"
          striped
          responsive
        >
          <template #cell(id)="data">
            <span>
              {{ data.item.course.id }}
            </span>
          </template>
          <template #cell(code)="data">
            <span class="font-weight-bold d-block text-nowrap">
              {{ data.item.course.code }}
            </span>
          </template>
          <template #cell(name)="data">
            <span>
              {{
                $i18n.locale == "en"
                  ? data.item.course.name
                  : data.item.course.name_local
              }}
            </span>
          </template>
          <template #cell(term)="data">
            <span>
              {{
                $i18n.locale == "en"
                  ? data.item.term.name
                  : data.item.term.name_local
              }}
            </span>
          </template>
          <template #cell(grade)="data">
            <span>
              {{ data.item.grade_type.name }}
            </span>
          </template>
          <template #cell(gpa)="data">
            <span>
              {{ data.item.grade_type.gpa }}
            </span>
          </template>
          <template #cell(creditHour)="data">
            <span>
              {{ data.item.course.credit_hours }}
            </span>
          </template>
        </b-table>
      </template>
      <template #cell(total_gpa)="data">
        <span>
          {{ data.item.total_gpa ? data.item.total_gpa : "-" }}
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
import { mapActions } from "vuex";
import { getAuth } from "@/auth/utils";

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
    add: Boolean,
    title: String,
    title2: String,
    type: String,
    loading: false,
    noDetails: Boolean,
    head: Boolean,
    add_option: Boolean,
    table: { default: 3, type: Number },
    head_tuition: Boolean,
    head_grade: Boolean,
    settings: Boolean,
    remove_grades: Boolean,
    is_pg: Boolean,
    studentAccount: { default: false, type: Boolean },
    showDetailsValidation: { default: true, type: Boolean },
    cardStyle: {
      type: String,
      default: "",
    },
    customStyle: {
      default: false,
      type: Boolean,
      controlView: { default: false, type: Boolean },
      editMode: { default: false, type: Boolean},
    },
  },
  data() {
    return {
      selected: [],
      rerender: true,
      gradeYearsFields: [
        {
          key: "code",
          label: this.$t("Global.code"),
        },
        {
          key: "course",
          label: this.$t("Global.name"),
        },
        {
          key: "total",
          label: this.$t("Global.total"),
        },
        {
          key: "max_total",
          label: this.$t("Global.max_total"),
        },
        {
          key: "grade_type",
          label: this.$t("Global.grade_type"),
        },
      ],
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
    this.init();
  },
  methods: {
    ...mapActions({
      removeGrade: "bylaws/removeGrade",
    }),
    checkInstallment(event, data) {
      this.$emit("getCheck", [event, data]);
      this.rerender = false;
      setTimeout((_) => {
        this.rerender = true;
      }, 2);
    },
    remove(id) {
      this.$swal({
        title: `${this.$t("Global.deleteTitle")}`,
        text: `${this.$t("Global.deleteText")}`,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.deleteBtn")}`,
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.removeGrade(id).then((_) => {
            this.$swal({
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              title: this.$t("Global.deleted"),
            });
            this.$emit("refresh");
          });
        }
      });
    },
    init() {
      if (this.studentAccount) {
        if (this.type == "terms_grades") {
          this.$store.dispatch("students/get", "academic/terms_grades");
        }
        if (this.type == "programs_levels_grades") {
          this.$store.dispatch(
            "students/get",
            "academic/programs_levels_grades"
          );
        }

        if (this.type == "registrations") {
          this.$store.dispatch("students/get", "academic/registrations");
        } else {
          this.$store.dispatch("students/get", "profile");
        }
      } else if (this.type) {
          this.$store.dispatch("students/get", {
            type: this.type,
            id: this.$route.params.id ? this.$route.params.id : (this.$route.params.student_id ? this.$route.params.student_id : null),
          });
      }
    },
  },
};
</script>

<style scoped>
.remove-padding {
  padding-left: 0;
  padding-right: 0;
}
</style>
