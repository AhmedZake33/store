<template>
  <!-- v-if="loading != -1" -->
  <b-overlay :show="loading || externalEquivLoad || internalEquivLoad" rounded="sm">
    <div v-if="!loading">
      <b-col cols="12">
        <b-card class="mb-0" :title="$t('Global.equivalence')">
          <b-row>
            <b-col cols="7" class="p-0" v-if="student && student.from ">
              <div class="mt-1 ml-1">
                {{ getTranslatedName(student.user) }}<br/>
                {{ $t("Global.name_previous_university") }} :
                {{student.from.university}} - {{ student.from.country }}<br/>
                {{ $t("Global.name_previous_faculty") }} :
                {{
                  student.from.faculty
                }}
              </div>
              <div class="mt-1 ml-1">
					  <span v-if="isInternalTransfer">
						{{ $t("Global.preference") }} :
						{{
                getTranslatedName(
                    student && student.desires && student.desires.faculty
                )
              }}
						<strong class="text-danger"> , </strong>
						{{
                getTranslatedName(
                    student && student.desires && student.desires.program
                )
              }}
					  </span>
              </div>
            </b-col>
            <b-col cols="7" class="p-0" v-else-if="student && transfer_id">
              <div class="mt-1 ml-1">
                {{ getTranslatedName(student.details.student_name) }}<br/>
                {{ $t("Global.name_previous_faculty") }} :
                {{ getTranslatedName(student.details.from.student_faculty) }} -
                {{ getTranslatedName(student.details.from.student_bylaw) }} -
                {{ getTranslatedName(student.details.from.student_program) }}
              </div>
              <div class="mt-1 ml-1">
					  <span>
						{{ $t("Global.preference") }} :
						{{
                getTranslatedName(student.details.to.student_faculty)
              }} - {{
                getTranslatedName(student.details.to.student_bylaw)
              }} - {{ getTranslatedName(student.details.to.student_program) }}
					  </span>
              </div>
            </b-col>
            <b-col cols="5">
              <b-row>
                <b-col>
                  <b>{{ $t("Hours") }}: </b>
                  <b-badge variant="primary" cols="2" style="padding: 10px">
                    {{ courses_hours }}
                  </b-badge>
                </b-col>
                <b-col>
                  <b>{{ $t("courses") }}: </b>
                  <b-badge variant="primary" style="padding: 10px" cols="2">
                    {{ count_courses }}
                  </b-badge>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card>
      </b-col>

      <!-- to select courses  -->
      <b-col cols="12" class="mt-1">
        <b-card :title="$t('Global.previous_courses')" class="mb-0">
          <b-table
              @sort-changed="sortingChanged"
              no-local-sorting
              class="position-relative font-small-2"
              :items="equivalent_courses"
              responsive
              :fields="selectorFields"
              primary-key="id"
              show-empty
              :loading="availableCoursesLoad"
              @Refresh="refreshAvailableCourses"
              :empty-text="$t('No Courses Founded')"
          >
            <template #thead-top="data">
              <b-tr>
                <b-th class="text-center" :colspan="student && student.previous_university_info &&
					 student.previous_university_info.bylaw_type == false ? 8 : 5">
                  <span>{{ $t("Global.courses") }}</span>
                </b-th>
                <b-th class="text-center" :colspan="5">{{ $t("Global.equivalent_courses") }}</b-th>
                <b-th colspan="1"><span class="sr-only"></span></b-th>
                <b-th colspan="1"><span class="sr-only"></span></b-th>
              </b-tr>
            </template>
            <!--Course Data-->
            <template #cell(code)="data">
              <strong>
                {{ data.item.code }}
              </strong>
            </template>
            <template #cell(name)="data">
              <strong>
                {{ data.item.title ? data.item.title : data.item.name }}
              </strong>
            </template>
            <template #cell(grade)="data">
              <strong class="mr-2">
                {{ data.item.grade ? data.item.grade : (data.item.grade_type ? data.item.grade_type.name : "-") }}
              </strong>
            </template>

            <!--Equivalent Courses Data-->
            <template #cell(equivalent_code)="data">
              <div
                  v-show="data.item.temp && data.item.temp.length"
                  v-for="course in data.item.temp"
                  :key="course.id"
              >
                <strong>
                  {{ course.course.code || "-" }}
                </strong>
              </div>
              <div v-show="data.item.temp && data.item.temp.length == 0">-</div>
            </template>

            <template #cell(equivalent_name)="data">
              <div
                  v-show="data.item.temp && data.item.temp.length"
                  v-for="course in data.item.temp"
                  :key="course.id"
              >
                <strong>
                  {{ getTranslatedName(course.course) }}
                </strong>
              </div>
              <div v-show="data.item.temp && data.item.temp.length == 0">-</div>
            </template>

            <template #cell(equivalent_ch)="data">
              <div
                  v-show="data.item.temp && data.item.temp.length"
                  v-for="course in data.item.temp"
                  :key="course.id"
              >
                <strong>
                  {{ course.credit_hours }}
                </strong>
              </div>
              <div v-show="data.item.temp && data.item.temp.length == 0">-</div>
            </template>

            <template #cell(equivalent_total)="data">
              <div
                  v-show="data.item.temp && data.item.temp.length"
                  v-for="course in data.item.temp"
                  :key="course.id"
              >
                <strong>
                  {{ course.total ? course.total : "-" }}
                </strong>
              </div>
              <div v-show="data.item.temp && data.item.temp.length == 0">-</div>
            </template>

            <template #cell(equivalent_max_total)="data">
              <div
                  v-show="data.item.temp && data.item.temp.length"
                  v-for="course in data.item.temp"
                  :key="course.id"
              >
                <strong>
                  {{ course.max_total ? course.max_total : "-" }}
                </strong>
              </div>
              <div v-show="data.item.temp && data.item.temp.length == 0">-</div>
            </template>

            <template #cell(equivalent_grade)="data">
              <div
                  v-show="data.item.temp && data.item.temp.length"
                  v-for="course in data.item.temp"
                  :key="course.id"
              >
                <strong>
                  {{ isInternalTransfer ? course.grade_letter : "-" }}
                </strong>
              </div>
              <div v-show="data.item.temp && data.item.temp.length == 0">-</div>
            </template>

            <!--Unknown-->
            <template #cell(equiv_ext_name)="data">
              <div
                  v-show="data.item.temp && data.item.temp.length"
                  v-for="course in data.item.temp"
                  :key="course.id"
              >
                <strong>
                  {{ getTranslatedName(course.course) }}
                </strong>
              </div>
              <div v-show="data.item.temp && data.item.temp.length == 0">-</div>
            </template>
            <template #cell(equiv_ex_total)="data">
              <div
                  v-show="data.item.temp && data.item.temp.length"
                  v-for="course in data.item.temp"
                  :key="course.id"
              >
                <strong>
                  {{ course.credit_hours ? course.total : course.total || "-" }}
                </strong>
              </div>
              <div v-show="data.item.temp && data.item.temp.length == 0">-</div>
            </template>

            <template #cell(equivalent_description)="data">
              <div
                  v-show="data.item.temp && data.item.temp.length"
                  v-for="course in data.item.temp"
                  :key="course.id"
              >
                <strong>
                  {{ course.course.description || "-" }}
                </strong>
              </div>
              <div v-show="data.item.temp && data.item.temp.length == 0">-</div>
            </template>
            <template #cell(equivalent_credit_hours)="data">
              <div
                  v-show="data.item.temp && data.item.temp.length"
                  v-for="course in data.item.temp"
                  :key="course.id"
              >
                <strong>
                  {{ course.credit_hours || "-" }}
                </strong>
              </div>
              <div v-show="data.item.temp && data.item.temp.length == 0">-</div>
            </template>

            <template #cell(equiv_ext_max_total)="data">
              <div
                  v-show="data.item.temp && data.item.temp.length"
                  v-for="course in data.item.temp"
                  :key="course.id"
              >
                <strong>
                  {{ course.max_total ? course.max_total : course.max_total || "-" }}
                </strong>
              </div>
              <div v-show="data.item.temp && data.item.temp.length == 0">-</div>
            </template>

            <template #cell(actions)="data">
              <div style="flex-direction: column; gap: 0em">
                <div>
                  <feather-icon
                      v-b-tooltip.hover="$t('Equivalent')"
                      icon="EditIcon"
                      style="cursor: pointer"
                      @click="selectTransferCourse(data.item)"
                  />
                </div>
              </div>
            </template>
          </b-table>
          <b-modal
              hide-footer
              id="modal_success"
              v-model="dialog"
              no-close-on-backdrop
              size="lg"
              :title="$t('Avalible Courses')"
          >
            <internalProgramCourses
                v-if="isInternalTransfer"
                :requestId="requestId"
                @RefreshParent="init"
                :programId="programId"
                :relatedCourseId="relatedCourseId"
                @hideModal="hideModal()"
            />
            <externalProgramCourses
                v-else
                :applicant_id="applicant_id"
                @RefreshParent="init"
                :programId="programId"
                :relatedCourseId="relatedCourseId"
                @hideModal="hideModal()"
            />
          </b-modal>
        </b-card>
      </b-col>

      <b-col cols="6" md="3" class="mt-1 mx-2" v-if="showApplyButton">
        <b-button
            class="btn-icon mr-1 small"
            :class="loading ? 'disabled_all' : ''"
            variant="primary"
            @click="applyTransfer()"
            v-if="
				  (status &&
					status.key == 'DISTRIBUATION_REQUIRED' &&
					hasPermission('equivalize_courses_applicant')) ||
				  (!status && studentComponent)
				"
        >
          {{ $t("Apply Equivalence") }}
        </b-button>
      </b-col>
      <b-modal
          id="modalPopover"
          v-model="rejectDialog"
          no-close-on-backdrop
          size="md"
          :title="$t('Reject Transfer')"
      >
        <validation-observer ref="rejectForm">
          <b-form>
            <div class="row">
              <b-col md="12">
                <b-form-group
                    :label="$t('Reject Reason')"
                    label-for="reject-reason"
                    invalid-feedback=""
                >
                  <validation-provider
                      #default="{ errors }"
                      name="reject-reason"
                      rules="required"
                  >
                    <b-form-textarea
                        id="name-input"
                        c
                        v-model="reject_reason"
                        :state="errors.length > 0 ? false : null"
                    />
                    <small v-if="errors.length" class="text-danger">{{
                        validation(null, 0).message
                      }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
            </div>
          </b-form>
        </validation-observer>
        <template #modal-footer>
          <b-row>
            <b-col md="12">
              <b-button
                  type="submit"
                  variant="primary"
                  class="mr-1"
                  @click="rejectTransferRequest()"
              >
                {{ $t("Global.save") }}
              </b-button>
              <b-button
                  type="reset"
                  variant="outline-secondary"
                  @click="rejectDialog = false"
              >
                {{ $t("Global.cancel") }}
              </b-button>
            </b-col>
          </b-row>
        </template>
      </b-modal>
    </div>
  </b-overlay>
</template>
<script>
import {
  BCard,
  BRow,
  BCol,
  BOverlay,
  BCardHeader,
  BButton,
  BTable,
  BLink,
  BBadge,
  BButtonGroup,
  BModal,
  BForm,
  BFormInput,
  BFormGroup,
  BFormTextarea,
  BTr,
  BTh,
} from "bootstrap-vue";
import {mapGetters, mapActions} from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import DataTable from "@/views/components/table/DataTable";
import FeatherIcon from "@/@core/components/feather-icon/FeatherIcon.vue";
import {ValidationProvider, ValidationObserver, localize} from "vee-validate";
import {required, between} from "@validations";
import externalProgramCourses from "@/views/admission/TransferStudents/program_courses.vue";
import internalProgramCourses from "@/views/students/student/transfer/components/program_courses.vue";
import programCourses from "@/views/students/student/transfer/components/program_courses.vue";

export default {
  name: "Transfer",
  props: {
    applicant_id: Number,
    transfer_id: Number,
    showApplyButton: {
      default: true,
      type: Boolean
    },
    isInternalTransfer: {
      default: false,
      type: Boolean
    },
    status: Object,
    studentComponent: Boolean,
  },
  components: {
    programCourses,
    BCard,
    BRow,
    BTr,
    BTh,
    BCol,
    BOverlay,
    BCardHeader,
    BButton,
    BTable,
    BLink,
    BBadge,
    BButtonGroup,
    vSelect,
    DataTable,
    FeatherIcon,
    BModal,
    ValidationProvider,
    ValidationObserver,
    localize,
    BForm,
    BFormInput,
    BFormGroup,
    BFormTextarea,
    externalProgramCourses,
    internalProgramCourses,
  },
  directives: {
    Ripple,
  },

  data() {
    return {
      dialog: false,
      rejectDialog: false,
      courses: [],
      equivalent_courses: [],
      program_courses: [],
      loading: true,
      student: {},
      studentId: null,
      studyingStudentStatus: true,
      filter: {
        faculty_id: null,
        bylaw_id: null,
        program_id: null,
      },
      totalAvailableCourses: null,
      availableCoursesLoad: null,
      availableCoursesQuery: null,
      course: {
        course_id: null,
        name: null,
        name_local: null,
        max_total: null,
        credit_hours: null,
      },

      count_courses: 0,
      courses_hours: 0,
      student_gpa: 0,
      transfer_detalis: {},
      reject_reason: null,
      programId: null,
      relatedCourseId: null,
      bylawType: null,
    };
  },
  computed: {
    ...mapGetters({
      externalEquivLoad: "externalTransfer/courseLoad",
      internalEquivLoad: "internalTransfer/courseLoad",
    }),
    requestId() {
      if (this.student?.details?.transfer_request?.id)
        return this.student.details.transfer_request.id
      else
        return 0;
    },
    locale() {
      return this.$i18n.locale == "ar" ? "ar-EG" : "en-US";
    },
    getTemps() {
      if (this.courses && this.courses.length) {
        return true;
      }
      return false;
    },
    query() {
      const data = {
        faculties: true,
      };
      return data;
    },
    selectorFields() {
      if (
          this.student &&
          this.student.previous_university_info &&
          this.student.previous_university_info.bylaw_type == false
      ) {
        return [
          {
            key: "code",
            label: this.$t("code"),
            sortable: false,
            thStyle: {width: "2%"},
          },
          {
            key: "name",
            label: this.$t("name"),
            sortable: false,
            thStyle: {width: "2%"},
          },
          {
            key: "description",
            label: this.$t("Description"),
            sortable: false,
            thStyle: {width: "2%"},
          },
          {
            key: "tutorial_hours",
            label: this.$t("Global.sm_tutorial_hours"),
            sortable: false,
            thStyle: {width: "2%"},
          },
          {
            key: "laboratory_hours",
            label: this.$t("Global.sm_laboratory_hours"),
            sortable: false,
            thStyle: {width: "2%"},
          },
          {
            key: "lecture_hours",
            label: this.$t("Global.sm_lecture_hours"),
            sortable: false,
            thStyle: {width: "2%"},
          },
          {
            key: "total",
            label: this.$t("Total"),
            sortable: false,
            thStyle: {width: "2%"},
          },
          {
            key: "max_total",
            label: this.$t("Max Total"),
            tdClass: "grade_class",
            sortable: false,
            thStyle: {width: "2%"},
          },
          {
            key: "equivalent_code",
            label: this.$t("code"),
            sortable: false,
            thStyle: {width: "2%"},
          },
          {
            key: "equiv_ext_name",
            label: this.$t("name"),
            sortable: false,
            thStyle: {width: "2%"},
          },
          {
            key: "equivalent_description",
            label: this.$t("Description"),
            sortable: false,
            thStyle: {width: "2%"},
          },
          {
            key: "equivalent_credit_hours",
            label: this.$t("Credit Hours"),
            sortable: false,
            thStyle: {width: "2%"},
          },
          {
            key: "equiv_ex_total",
            label: this.$t("Total"),
            sortable: false,
            thStyle: {width: "2%"},
          },
          {
            key: "equiv_ext_max_total",
            label: this.$t("Max Total"),
            sortable: false,
            thStyle: {width: "2%"},
          },
          {
            key: "actions",
            label: this.$t("actions"),
            thClass: "customAction",
            tdClass: "customWidth",
            thStyle: {width: "2%"},
          },
        ];
      } else {
        return [
          {
            key: "code",
            label: this.$t("code"),
            sortable: false,
            thStyle: {width: "1%"},
          },
          {
            key: "name",
            label: this.$t("name"),
            sortable: false,
            thStyle: {width: "20%"},
          },
          {
            key: "credit_hours",
            label: this.$t("Credit Hours"),
            sortable: false,
          },
          {
            key: "max_total",
            label: this.$t("Max Total"),
            sortable: false,
          },
          {
            key: "grade",
            label: this.$t("Grade"),
            sortable: false,
            tdClass: "grade_class",
            thStyle: {width: "1%"},
          },
          {
            key: "equivalent_code",
            label: this.$t("Global.code"),
            sortable: false,
            thStyle: {width: "10%"},
          },
          {
            key: "equivalent_name",
            label: this.$t("name"),
            sortable: false,
            thStyle: {width: "20%"},
          },
          {
            key: "equivalent_ch",
            label: this.$t("Credit Hours"),
            sortable: false,
          },
          {
            key: "equivalent_total",
            label: this.$t("total"),
            sortable: false,
            thStyle: {width: "2%"},
          },
          {
            key: "equivalent_max_total",
            label: this.$t("max_total"),
            sortable: false,
            thStyle: {width: "2%"},
          },
          {
            key: "equivalent_grade",
            label: this.$t("Grade"),
            sortable: false,
          },

          {
            key: "actions",
            label: this.$t("actions"),
            thClass: "customAction",
            tdClass: "customWidth",
          },
        ];
      }
    },
    fields() {
      return [
        {
          key: "code",
          label: this.$t("code"),
          sortable: false,
        },
        {
          key: "course",
          label: this.$t("course"),
          thStyle: {width: "20%"},
          sortable: false,
        },
        {
          key: "credit_hours",
          label: this.$t("credit_hours"),
          sortable: false,
        },
        {
          key: "mapped_degree",
          label: this.$t("degree"),
          sortable: false,
        },
        {
          key: "max_total",
          label: this.$t("total"),
          sortable: false,
        },
        {
          key: "percentage",
          label: this.$t("percentage"),
          sortable: false,
        },
        {
          key: "mapped_GPA",
          label: this.$t("GPA"),
          sortable: false,
        },
        {
          key: "mapped_letter",
          label: this.$t("GPA letter"),
          sortable: false,
        },
        {
          key: "actions",
          label: this.$t("actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
    },
    ...mapGetters({}),
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      getExternalStudentData: "externalTransfer/getExternalStudentData",
      getExternalTransferAvailableCourses: "externalTransfer/getExternalStudentCourses",
      getExternalTransferTempCourses: "externalTransfer/getTransferTempCourses",
      executeExternalStudentTransfer: "externalTransfer/executeStudentTransfer",

      getInternalStudentData: "internalTransfer/getInternalStudentData",
      getInternalTransferAvailableCourses: "internalTransfer/getTransferAvailableCourses",
      getInternalTransferTempCourses: "internalTransfer/getTransferTempCourses",
      executeInternalStudentTransfer: "internalTransfer/executeStudentTransfer",
    }),
    openDialog(data) {
      this.dialog = true;
      this.programId = this.isInternalTransfer ? this.student.details.to.student_program.id : this.student.desires.program.id;
      this.course.id = data.id;
      this.course.code = data.code;
      this.course.name = data.name;
      this.course.name_local = data.name_local;
      this.course.bylaw_id = data.bylaw_id;
      this.course.max_total = data.max_total;
      this.course.credit_hours = data.credit_hours;
    },
    openRejectDialog() {
      this.rejectDialog = true;
    },

    refreshAvailableCourses(query) {
      if (this.filter) {
        query = {...query, ...this.filter};
      }
      // to store query and use it again after update table in add and drop
      this.availableCoursesQuery = query;

      this.availableCoursesLoad = true;

      let method = !this.isInternalTransfer ? this.getExternalTransferAvailableCourses({id: this.applicant_id}) : this.getInternalTransferAvailableCourses({id: this.student.details.transfer_request.id});
      method.then((data) => {
        this.equivalent_courses = data.data;
        this.availableCoursesLoad = false;
      });
    },
    selectTransferCourse(data) {
      this.relatedCourseId = this.isInternalTransfer ? data.course.id : data.id;
      this.openDialog(data);
    },

    removeDuplicates(arr) {
      return arr.filter(
          (value, index, self) =>
              index === self.findIndex((t) => t.course_id === value.course_id)
      );
    },

    init() {
      this.courses_hours = 0;
      this.count_courses = 0;
      this.loading = true;

      let method = !this.isInternalTransfer ? this.getExternalStudentData({id: this.applicant_id}) : this.getInternalStudentData({id: this.transfer_id});
      method
          .then((data) => {
            this.loading = false;
            this.student = data;
            if (this.student.previous_university_info) {

              if (this.student.previous_university_info.bylaw_type == false) {
                this.bylawType = this.$t("Global.semester_base");
              }
              if (this.student.previous_university_info.bylaw_type == true) {
                this.bylawType = this.$t("Global.credit_hours");
              }
            }

            let availableCoursesMethod = !this.isInternalTransfer ? this.getExternalTransferAvailableCourses({id: this.applicant_id}) : this.getInternalTransferAvailableCourses({id: this.student.details.transfer_request.id});
            availableCoursesMethod.then((d) => {
              this.equivalent_courses = d.data;
              this.availableCoursesLoad = false;
            });

            let tempCoursesMethod = !this.isInternalTransfer ? this.getExternalTransferTempCourses(this.applicant_id) : this.getInternalTransferTempCourses(this.student.details.transfer_request.id);
            tempCoursesMethod.then((data) => {
              this.courses = data.courses_selected;
              if (this.courses.length > 0) {
                this.removeDuplicates(this.courses).forEach((el) => {
                  this.count_courses++;
                  this.courses_hours += el["credit_hours"];
                });
              }
            });
          })
          .catch((error) => {
          });
    },
    applyTransfer() {
      this.loading = true;
      let payload = {
        id: !this.isInternalTransfer ? this.applicant_id : this.student.details.transfer_request.id,
        type: this.$route.name == "student-show" ? "student" : "",
      };
      let method = !this.isInternalTransfer ? this.executeExternalStudentTransfer(payload) : this.executeInternalStudentTransfer(payload);
      method
          .then((data) => {
            if (data.status === "success") {
              this.successToast(data.message);
              this.loading = false;
              this.$emit("Refresh");
              // this.$router.go(-1)
            }
          })
          .catch((error) => {
            this.errorToast(error.title);
          });
    },

    rejectTransferRequest() {
      this.$nextTick((_) => {
        this.$refs.rejectForm.validate().then((success) => {
          if (success) {
            const payload = {
              transfer_id: this.transfer_id,
              query: {reject_reason: this.reject_reason},
            };
            this.loading = true;
            this.rejectTransfer(payload)
                .then((data) => {
                  if (data.status === "success") {
                    this.successToast(data.message);
                    this.loading = false;
                    // this.$router.go(-1)
                    this.$emit("Refresh");
                  }
                })
                .catch((error) => {
                  this.errorToast(error.title);
                });
          }
        });
      });
    },
    hideModal() {
      this.dialog = false;
    },
  },
};
</script>
<style>
/* .input-group {

     margin-left: 121px;
  } */
.grade_class {
  border-right: 2px solid #ddd;
  padding-right: 10px !important;
}
</style>
