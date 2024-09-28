<template>
  <b-row>
    <b-col cols="12">
      <b-card>
        <b-tabs
          v-model="inputTab"
          ref="custom_tabs"
          lazy
          vertical
          nav-wrapper-class=" nav-hidden custom_slider"
          align="center"
        >
          <div
            class="custom_drop mb-2"
            v-if="window.width < 982 && window.width != 0"
            :class="!rerender ? 'py-3' : ''"
          >
            <b-dropdown
              block
              v-if="rerender"
              :text="getSelectedTab ? getSelectedTab.name : ''"
              variant="primary"
            >
              <b-dropdown-item
                @click="setSelectedTab(tab)"
                v-for="tab in dropTabs"
              >
                {{ tab.name }}
              </b-dropdown-item>
            </b-dropdown>
          </div>

          <b-tab style="position: relative">
            <template #title>
              <feather-icon icon="BookIcon" />
              <span>{{
                $i18n.locale == "en"
                  ? "Study Current Semester"
                  : "مواد هذا الفصل"
              }}</span>
            </template>
            <b-table
              v-if="student"
              :type="student.registrations ? null : 'registrations'"
              :busy="load"
              :empty-text="$t('Global.empty_text')"
              show-empty
              :items="student.registrations"
              :fields="registrationFields"
              striped
              responsive="sm"
            >
              <template #cell(id)="data">
                <span>
                  <b-link
                    v-b-tooltip.hover="'Offering id' ? 'كود المقرر' : '-'"
                    class="font-weight-bold d-inline-block"
                    :to="{
                      name: 'offering',
                      params: { id: data.item.offering_id },
                    }"
                  >
                    {{ data.item.offering_id ? data.item.offering_id : "-" }}
                  </b-link>
                </span>
              </template>

              <template #cell(code)="data">
                <span
                  v-b-tooltip.hover="'Course Code' ? 'كود الماده العلميه' : '-'"
                >
                  {{ data.item.code ? data.item.code : "-" }}
                </span>
              </template>
              <template #cell(name)="data">
                <span>
                  <b-link
                    class="font-weight-bold d-inline-block"
                    :to="{ name: 'course', params: { id: data.item.id } }"
                  >
                    {{
                      $i18n.locale == "en"
                        ? data.item.name
                        : data.item.name_local
                    }}
                  </b-link>
                </span>
              </template>
              <template #cell(max_total)="data">
                <span>
                  {{ data.item.max_total }}
                </span>
              </template>
              <template #cell(credit)="data">
                <span>
                  {{ data.item.credit_hours }}
                </span>
              </template>
              <template #table-busy>
                <div class="text-center text-black my-2">
                  <b-spinner class="align-middle" />
                </div>
              </template>
            </b-table>
          </b-tab>
          <!----Taken Course--->
          <b-tab>
            <template #title>
              <feather-icon icon="TrendingUpIcon" />
              <span>{{ $t("Global.takenCourses") }}</span>
            </template>

            <simple-table
              :fields="[
                $t('course'),
                $t('code'),
                $t('credit_hours'),
                $t('term'),
                $t('Credit Points'),
                $t('Global.grade'),
              ]"
              :items="student.CoursesAtall"
              :load="load"
            >
            </simple-table>
          </b-tab>
          <b-tab
            v-if="
              student.program &&
              student.program.bylaw &&
              student.program.bylaw.type_id == 1
            "
          >
            <template #title>
              <feather-icon icon="TrendingUpIcon" />
              <span>{{ $t("Global.passed_terms") }}</span>
            </template>

            <TabTable
              :controlView="true"
              v-if="student"
              :loading="load"
              :type="student.terms_grades ? null : 'terms_grades'"
              :items="student.terms_grades"
              :fields="[
                { key: 'term_name', label: this.$t('Global.grade_term') },
                { key: 'total_gpa', label: this.$t('semester_gpa') },
                {
                  key: 'total_credit_hours',
                  label: this.$t('Global.credit_hours'),
                },
              ]"
              :inner="[
                {
                  key: 'code',
                  label: this.$t('Global.code'),
                  thStyle: { width: '10%' },
                },
                { key: 'course', label: this.$t('Global.course') },
                {
                  key: 'credit_hours',
                  label: this.$t('Global.credit_hours'),
                  thStyle: { width: '10%' },
                },
                {
                  key: 'total_max_total',
                  label: this.$t('Global.total'),
                  thStyle: { width: '10%' },
                },
                {
                  key: 'credit_points',
                  label: this.$t('Global.credit_points'),
                  thStyle: { width: '10%' },
                },
                {
                  key: 'grade_type',
                  label: this.$t('Global.grade_name'),
                  thStyle: { width: '10%' },
                },
              ]"
            />
          </b-tab>
          <b-tab v-else>
            <template #title>
              <feather-icon icon="TrendingUpIcon" />
              <span>{{ $t("Global.grades_years") }}</span>
            </template>
            <TabTable
              v-if="student"
              :type="
                student.programs_levels_grades ? null : 'programs_levels_grades'
              "
              :items="student.programs_levels_grades"
              :fields="[
                {
                  key: 'year',
                  label: this.$t('Global.year'),
                  thStyle: { width: '10%' },
                },
                {
                  key: 'grade_level',
                  label: this.$t('Global.level'),
                  thStyle: { width: '25%' },
                },
                {
                  key: 'total_grade',
                  label: this.$t('total_grade'),
                  thStyle: { width: '35%' },
                },
              ]"
              :inner="[
                {
                  key: 'code',
                  label: this.$t('Global.code'),
                  thStyle: { width: '10%' },
                },
                { key: 'course', label: this.$t('Global.course') },
                {
                  key: 'total',
                  label: this.$t('Global.total'),
                  thStyle: { width: '10%' },
                },
                {
                  key: 'max_total',
                  label: this.$t('Global.max_total'),
                  thStyle: { width: '10%' },
                },
                {
                  key: 'grade_type',
                  label: this.$t('Global.grade_name'),
                  thStyle: { width: '10%' },
                },
              ]"
            />
          </b-tab>
        </b-tabs>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import {
  BTab,
  BTabs,
  BDropdown,
  BDropdownItem,
  BCard,
  BCol,
  BRow,
  BAvatar,
  BTable,
  BSpinner,
  BLink,
} from "bootstrap-vue";
import List from "@/views/components/info/list";
import ShowTable from "@/views/students/student/components/ShowTable";
import TabTable from "@/views/students/student/components/TabTable";
import StudySchedule from "@/views/study/schedule/students/scheduling/calendar/Calendar";
import ExamsSchedules from "@/views/students/student/components/ExamSchedule";
import Payments from "@/views/students/payments/components/payments";
import Credits from "@/views/students/credits/components/credits";
import Certificates from "@/views/students/certificates/components/certificate";
import Archive from "@/views/administration/archive/components/archive";
import ShowComponent from "@/views/components/info/show";
import SimpleTable from "@/views/components/table/SimpleTable";
//import edit from "./edit";
//import { bus } from "./StudentBus";

export default {
  name: "Show",
  components: {
    SimpleTable,
    ShowComponent,
    BDropdownItem,
    BDropdown,
    BAvatar,
    Archive,
    Credits,
    Certificates,
    StudySchedule,
    ExamsSchedules,
    Payments,
    ShowTable,
    TabTable,
    List,
    BTabs,
    BTab,
    BCard,
    BCol,
    BRow,
    BTable,
    BSpinner,
    BLink,
    SimpleTable,
    // edit,
  },
  data() {
    return {
      width: 0,
      ifMobile: false,
      rerender: true,
      inputTab: 0,
      dropTabs: [],
      selectedTab: 0,
      windowWidth: window.innerWidth,
      window: {
        width: 0,
        height: 0,
      },
      lang: this.$i18n.locale,
      tabIndex: 3,
      applicantData: null,
      enableEditMode: false,
      editModeVersion: "",
      academic: false,
      personal: false,
      prestudy: false,
      renderStudyScheduleComponent: true,
    };
  },
  computed: {
    ...mapGetters({
      student: "students/item",
      load: "students/load",
      role: "roles/userRoles",
      studentData: "students/student",
      editModeComputed: "students/isEditMode",
      editPage: "students/editPage",
    }),
    term_id() {
      if (this.student.term) {
        return this.student.term.id;
      }
    },
    getSelectedTab() {
      if (this.dropTabs) {
        return this.dropTabs.find((el) => el.id == this.selectedTab);
      } else {
        return this.dropTabs[0];
      }
    },
    id() {
      return this.$route.params.student_id
        ? this.$route.params.student_id
        : null;
    },
    localLang() {
      return this.$i18n.locale;
    },
    mainData() {
      if (this.student) {
        return this.student.student;
      }
    },
    langChanged(val) {
      let langData = this.$i18n.locale;
      if (langData != this.lang) {
        this.lang = langData;
        this.changed = false;
      }
      this.chaged = true;
    },
    changed(val) {
      return val;
    },
    registrationFields() {
      return [
        {
          key: "id",
          label: this.$t("Global.id"),
        },
        {
          key: "code",
          label: this.$t("Global.code"),
        },
        {
          key: "name",
          label: this.$t("name"),
        },
        {
          key: "max_total",
          label: this.$t("max_total"),
        },
        {
          key: "credit",
          label: this.$t("credit_hours"),
        },
      ];
    },
    applicant() {
      return this.applicantData;
    },
    isEditMode() {
      return this.enableEditMode;
    },
    EditModeData() {
      return this.editModeVersion;
    },
    changeMode() {
      return this.changeModeData;
    },
    changeTabs() {
      return this.isChangeTabs;
    },
    busComputed() {
      return this.busWorking;
    },
    academicEdit() {
      return this.academic;
    },
    prestudyEdit() {
      return this.prestudy;
    },
    personalEdit() {
      return this.personal;
    },
  },

  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.init();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    ...mapMutations({
      setLoad: "students/SET_ITEMS_LOAD",
    }),
    // setSelectedTab(num) {
    //   this.selectedTab = num.id;
    //   this.inputTab = num.id;
    //   this.rerender = false;
    //   setTimeout(() => {
    //     this.rerender = true;
    //   }, 10);
    // },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },
    init() {},
    linkClass(idx) {
      if (0 === idx) {
        return ["mt-1"];
        // return ['border','border-bottom-3']
      } else if (3 === idx) {
        try {
          let ele = document.getElementById("exam_schedule");
          ele.parentElement.style.position = "relative";
          ele.parentElement.parentElement.classList.add("info-tap");
        } catch (e) {}
      } else {
        try {
          let ele = document.getElementById("prestudyInfo");
          ele.parentElement.style.position = "relative";
          ele.parentElement.parentElement.classList.add("info-tap");
        } catch (e) {}
      }
    },
    getTotal(data) {
      let total = (data.total_marks / data.max_marks) * 100;
      if (total) {
        return total.toFixed(2) + "%";
      }
      return 0;
    },
    getSubjects(data, subjects) {
      let array = [];
      subjects.forEach((element, i) => {
        if (data[element]) {
          array.push(element);
        }
      });
      return array;
    },
    getCustomData(data) {
      delete data["pre_university_certificate_groupe"];
      delete data["pre_university_certificate_type"];
      delete data["pre_university_certificate"];
      return data;
    },
    closeEditMode() {
      this.isChangeTabs = true;
      this.enableEditMode = false;
      // bus.$emit("closeEditMode", false);
    },
    editMode(editpage) {
      if (editpage == "personal_info") {
        this.academic = false;
        this.prestudy = false;
        this.personal = true;
      } else if (editpage == "academic_info") {
        this.prestudy = false;
        this.personal = false;
        this.academic = true;
      }
      this.editModeVersion = editpage;
      this.enableEditMode = !this.enableEditMode;
      // this.$router.push({ name: 'student-edit', params: { id: this.id, details: editpage } })
    },
  },
  watch: {
    inputTab: function (val) {
      if (val === 0) {
        this.setLoad(true);
        this.$store
          .dispatch("students/get", `${this.id}/registrations`)
          .then((res) => {
            this.setLoad(false);
          });
      }
      if (val === 1) {
        this.setLoad(true);
        this.$store
          .dispatch("students/get", `${this.id}/courses_history`)
          .then((res) => {
            this.setLoad(false);
          });
      }
      this.selectedTab = val;
    },
    lang: function () {
      this.changed = false;
      this.changed = true;
    },
    localLang: function () {
      // remove the my-component component from the DOM
      this.renderStudyScheduleComponent = false;
      this.$nextTick(() => {
        // add my-component component in DOM
        this.renderStudyScheduleComponent = true;
      });
    },
    prestudy: function (val) {},
  },
  created() {
    /*  bus.$on("closeEditMode", (data) => {
      this.enableEditMode = false;
      this.academic = false;
      this.prestudy = false;
      this.personal = false;
      this.init();
    }); */
  },
};
</script>

<style>
/*.sperator{*/
/*  border-bottom: 1px solid black;*/
/*  margin-bottom: 30px;*/
/*}*/
/*#parent-info {*/
/*  border-bottom: 1px solid black;*/
/*  margin-bottom: 30px;*/
/*}*/
/*ul.nav > li.nav-item > a.nav-link{*/
/*  border-bottom: 3px solid black;*/
/*}*/
.borderbottom {
  border-bottom: 3px solid black;
}

.info-tap::after {
  content: "";
  position: absolute;
  bottom: -9px;
  left: 0;
  height: 1px;
  width: 100%;
  background-color: #eee;
  padding-top: 3px;
  padding-bottom: 3px;
}
</style>
