<template>
  <div>
    <b-overlay :show="show" rounded="sm">
      <b-col cols="12" xl="12" lg="12" md="12">
        <b-card>
          <b-row v-if="offeringData">
            <b-col
              cols="21"
              xl="6"
              class="d-flex justify-content-between flex-column"
            >
              <div class="d-flex justify-content-start">
                <div class="d-flex flex-column ml-1">
                  <div v-if="offeringData.term" class="mb-1">
                    <h4 class="mb-0" style="font-weight: bold">
                      {{
                        $i18n.locale == "ar" && offeringData.course
                          ? offeringData.course.name_local
                          : offeringData.course.name
                      }}
                    </h4>

                    <span class="card-text d-block">{{
                      offeringData.course ? offeringData.course.code : ""
                    }}</span>
                    <!-- <span class="card-text">{{ $i18n.locale == 'ar' && item.status  ? item.status.name_local : item.status.name }}</span> -->
                  </div>
                </div>
              </div>
            </b-col>
            <b-col v-if="offeringData" cols="12" xl="6">
              <table class="mt-2 mt-xl-0" style="width: 100%">
                <tr>
                  <th class="pb-50 d-flex flex-wrap align-items-center">
                    <feather-icon icon="InfoIcon" class="mr-75" />
                    <span class="label">
                      {{ $t("Global.term") }}
                    </span>
                  </th>
                  <td v-if="offeringData.term" class="pb-50">
                    {{
                      $i18n.locale == "ar"
                        ? offeringData.term.name_local
                        : offeringData.term.name
                    }}
                  </td>
                </tr>
                <tr>
                  <th class="pb-50">
                    <feather-icon icon="FlagIcon" class="mr-75" />
                    <span class="label">{{ $t(`Global.control_status`) }}</span>
                  </th>
                  <td class="pb-50">
                    <span v-if="offeringData.status">
                      {{
                        $i18n.locale == "ar" && offeringData.status
                          ? offeringData.status.name_local
                          : offeringData.status.name
                      }}
                    </span>
                    <span v-else> - </span>
                  </td>
                </tr>
              </table>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <DataTable :allow-search="false" :basicTable="true">
        <template #custom_action>
          <div class="mx-2 my-2">
            <b-row>
              <b-col style="display: flex">
                <h4>{{ $t(`Global.control_status`) }} :</h4>
                <h4 v-if="$i18n.locale == 'en' && status">
                  {{ status.name ? status.name : status.name_local }}
                </h4>
                <h4 v-if="$i18n.locale == 'ar' && status">
                  {{ status.name_local ? status.name_local : status.name }}
                </h4>
              </b-col>

              <b-col style="display: flex; justify-content: flex-end">
                <div
                  v-if="
                    status &&
                    status.name === 'Submitted' &&
                    hasPermission('accept_controlAction')
                  "
                  style="margin: 3px"
                >
                  <b-button
                    class="btn w-100"
                    variant="primary"
                    style="float: right; font-size: 12px"
                    @click="reviewStatus"
                  >
                    {{ $t(`Global.review`) }}
                  </b-button>
                </div>
                <div
                  v-else-if="
                    status &&
                    status.name === 'Reviewed' &&
                    hasPermission('approve_controlAction')
                  "
                  style="margin: 3px"
                >
                  <b-button
                    class="btn w-100"
                    variant="primary"
                    style="float: right; font-size: 12px"
                    @click="approveStatus"
                  >
                    {{ $t(`Global.approve`) }}
                  </b-button>
                </div>
                <div
                  v-else-if="
                    status &&
                    status.name === 'Approved' &&
                    hasPermission('publish_controlAction')
                  "
                  style="margin: 3px"
                >
                  <b-button
                    class="btn w-100"
                    variant="primary"
                    style="float: right; font-size: 12px"
                    @click="publishStatus"
                  >
                    {{ $t(`Global.publish`) }}
                  </b-button>
                </div>

                <div style="margin: 3px">
                  <b-button
                    v-if="
                      status &&
                      status.name != 'Draft' &&
                      status.name != 'Submitted' &&
                      hasPermission('undo_controlAction')
                    "
                    class="btn w-100"
                    variant="warning"
                    style="float: right; font-size: 12px"
                    @click="undoStatus"
                  >
                    {{ $t(`Global.undo`) }}
                  </b-button>
                </div>
                <div
                  v-if="
                    status &&
                    status.name != 'Frozen' &&
                    hasPermission('freez_controlAction')
                  "
                  style="margin: 3px"
                >
                  <b-button
                    class="btn w-100"
                    variant="danger"
                    style="float: right; font-size: 12px"
                    @click="freezeStatus"
                  >
                    {{ $t(`Global.freeze`) }}
                  </b-button>
                </div>
              </b-col>
            </b-row>
          </div>
        </template>
      </DataTable>
      <DataTable :allow-search="false" :basicTable="true">
        <template #custom_action>
          <div>
            <b-row class="mx-2 my-2">
              <h4>{{ $t("Global.Grades Entry Form") }}</h4>
            </b-row>
            <b-row class="mx-2 my-2">
              <b-col md="3">
                <v-select
                  v-model="exams"
                  :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                  :options="examsFilter"
                  :label="getSelectLabel()"
                  class="w-100 mb-2"
                  :reduce="(val) => val.id"
                  :placeholder="$t('Global.exams')"
                >
                  <template v-slot:option="option">
                    {{ $i18n.locale == "ar" ? option.name_local : option.name }}
                  </template>
                  <template #selected-option="{ name, name_local }">
                    <div style="display: flex; align-items: baseline">
                      <strong v-if="$i18n.locale == 'ar'"
                        >{{ name_local ? name_local : name }}
                      </strong>
                      <strong v-else>{{ name ? name : name_local }} </strong>
                    </div>
                  </template>
                  <template #no-options>
                    {{ $t("noMatching") }}
                  </template>
                </v-select>
              </b-col>
              <b-col md="4">
                <b-form-group label-for="mc-barcode">
                  <validation-provider
                    #default="{ errors }"
                    name="barcode"
                    rules=""
                  >
                    <b-form-input
                      :placeholder="$t('Global.barcode')"
                      id="mc-barcode"
                      type="text"
                      v-model="barcode"
                      :state="errors.length > 0 ? false : null"
                      :disabled="!exams"
                    />

                    <ValidationErrors :frontend-errors="errors" />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="3">
                <b-form-group label-for="mc-grade">
                  <validation-provider
                    #default="{ errors }"
                    name="grade"
                    rules=""
                  >
                    <b-form-input
                      :placeholder="$t('Global.grade')"
                      id="mc-grade"
                      type="text"
                      v-model="grade"
                      :state="errors.length > 0 ? false : null"
                      
                      :disabled="!barcode"
                    />

                    <ValidationErrors :frontend-errors="errors" />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col
                md="2"
                style="
                  display: flex;
                  justify-content: flex-end;
                  align-items: flex-start;
                "
              >
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  type="submit"
                  variant="primary"
                  class="mr-1"
                  @click="updateGradeBarcode"
                  :disabled="!grade"
                >
                  {{ $t("Global.submit") }}
                </b-button>
                <b-button
                  v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                  type="reset"
                  variant="primary"
                  @click="reset"
                  class="btn-icon"
                  v-b-tooltip.hover="$t('Global.reset')"
                >
                  <feather-icon icon="RotateCwIcon" />
                </b-button>
              </b-col>
            </b-row>
          </div>
        </template>
      </DataTable>
      <DataTable
        :allow-search="true"
        @reset="reset"
        :total="totalBarcodes"
        :filter="filter"
        @Refresh="refresh"
      >
        <template #customTable>
          <b-table
            :items="checkStudentsBarcodes"
            responsive
            striped
            :fields="fields"
            primary-key="id"
            show-empty
            :empty-text="$t('Global.empty_text')"
          >
            <template #cell(barcode)="data">
              <div class="d-flex">
                <span v-if="data.item.barcode">
                  {{ data.item.barcode }}
                </span>
              </div>
            </template>

            <template #cell(gpa)="data">
              <div class="d-flex">
                <span v-if="data.item.registration">
                  {{
                    data.item.registration && data.item.registration.gpa
                      ? data.item.registration.gpa
                      : "-"
                  }}
                </span>
              </div>
            </template>
            <template #cell(grade)="data">
              <div class="d-flex">
                <span v-if="data.item.registration">
                  {{
                    data.item.registration &&
                    data.item.registration.grade_type &&
                    data.item.registration.grade_type.name
                      ? data.item.registration.grade_type.name
                      : "-"
                  }}
                </span>
              </div>
            </template>

            <!--   <template #cell(status)="data">
                    <div class="d-flex">
                       <span v-if="$i18n.locale == 'en' && data.item.status">
                       {{data.item.status.name? data.item.status.name: data.item.status.name_local}}
                       </span>
                       <span v-if="$i18n.locale == 'ar' && data.item.status">
                       {{data.item.status.name_local? data.item.status.name_local: data.item.status.name}}
                       </span>
                    </div> 
                    </template> -->
            <template #cell(actions)="data">
              <div>
                <b-dropdown
                v-if="needDrop"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="flat-primary"
                class="dropdown-icon-wrapper custom_action_drop"
              >
                <template #button-content>
                  <feather-icon
                    icon="MoreVerticalIcon"
                    size="16"
                    class="align-middle"
                  />
                </template>
              </b-dropdown>
                <b-link>
                  <feather-icon
                    icon="EditIcon"
                    v-b-tooltip.hover="$t('Global.edit_grades')"
                    class="text-primary"
                    @click="openGradesDialog(data.item.registration)"
                  />
                </b-link>
              </div>
            </template>
          </b-table>
        </template>
      </DataTable>
      <DataTable :allow-search="false" :basicTable="true">
        <template #custom_action>
          <div class="mx-2 my-2">
            <b-row>
              <b-col>
                <h4>{{ $t(`Global.configure_barcode_reader`) }} :</h4>
              </b-col>
            </b-row>
            <b-row>
              <img
                src="./qr-code-test.png"
                style="
                  width: 30%;
                  display: block;
                  margin-left: auto;
                  margin-right: auto;
                "
              />
            </b-row>
          </div>
        </template>
      </DataTable>

      <b-modal
        id="modal"
        v-model="grades_dialog"
        no-close-on-backdrop
        size="lg"
        :title="$t('Global.edit_gardes')"
      >
        <validation-observer ref="simpleForm">
          <b-form ref="simpleForm" @keydown.enter="submit_grades">
            <div class="row">
              <b-col md="6" v-for="mark in termCoursesMarks" :key="mark.id">
                <b-form-group
                  :label="mark.name + '(' + mark.max + ')'"
                  label-for="mc-mark"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="mark"
                    rules="integer|positive"
                  >
                    <b-form-input
                      id="mc-mark"
                      type="number"
                      v-model="mark.value"
                      :state="errors.length > 0 ? false : null"
                      @change="checkMarks"
                    />

                    <ValidationErrors :frontend-errors="errors" />
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
                @click="submit_grades"
              >
                {{ $t("Global.save") }}
              </b-button>

              <b-button
                type="reset"
                variant="outline-secondary"
                @click="grades_dialog = false"
              >
                {{ $t("Global.cancel") }}
              </b-button>
            </b-col>
          </b-row>
        </template>
      </b-modal>
    </b-overlay>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
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
  BModal,
  VBModal,
  BPopover,
  BFormGroup,
  BForm,
} from "bootstrap-vue";
import { mapActions, mapGetters } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import Add from "@/views/study/offerings/components/add_linked_offering";
import DataTable from "@/views/components/table/DataTable";
import { EventBus } from "@/main";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import { required, email, regex, integer, positive } from "@validations";
export default {
  name: "barcode",
  components: {
    DataTable,
    BCard,
    Add,
    vSelect,
    BRow,
    BCol,
    BOverlay,
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
    BModal,
    VBModal,
    BPopover,
    BFormGroup,
    ValidationProvider,
    ValidationObserver,
    localize,
    ValidationErrors,
    BForm,
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  props: {},
  data() {
    return {
      params: {},
      newLinkedOffering: false,
      changeName: null,
      show: true,
      items: null,
      exams: null,
      examsFilter: [],
      barcode: null,
      grade: null,
      filteredItems: null,
      studentsBarcodes: null,
      status: null,
      grades_dialog: false,
      termCoursesMarks: null,
      offeringData: null,
      total: 0,
      filter: {},
      //loadingWithOutBarCode: false,
      offeringMaxTotal:0,
    };
  },
  computed: {
    ...mapGetters({
      totalBarcodes: "offerings/totalBarcodes",
      needDrop:'app/needDrop',
    }),
    fields() {
      let arrFields = [
        {
          key: "barcode",
          label: this.$t("Global.barcode"),
          sortable: true,
          /* thStyle: {backgroundColor: '#080'}, */
        },
      ];
      if (this.offeringData && this.offeringData.offering_marks) {
        this.offeringData.offering_marks.forEach((exam) => {
          if (exam.pivot && exam.pivot.name) {
            arrFields.push(
              { 
                key: exam.pivot.name, 
                label: exam.pivot.name, 
                sortable: true,
                tdClass: this.exams == exam.pivot.id ? 'tdcustom' : '',
                thStyle: this.exams == exam.pivot.id ? {backgroundColor: '#3981e73d'} : '',
              }
            );
           
          }
        });
      }
      arrFields.push(
        {
          key: "total",
          label: this.$t("Global.total"),
          sortable: true,
        },
        {
          key: "max_total",
          label: this.$t("Global.max_total"),
          sortable: true,
        },
        {
          key: "percentage",
          label: this.$t("Global.percentage"),
          sortable: true,
        },

        {
          key: "gpa",
          label: this.$t("Global.gpa"),
          sortable: true,
        },
        {
          key: "grade",
          label: this.$t("Global.grade"),
          sortable: true,
        },

        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        }
      );

      return arrFields;
    },
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    checkStudentsBarcodes() {
      let data = [];
      if (this.filteredItems) {
        data = this.filteredItems;
      }
      return data;
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    barcode: function (newValue) {
      this.checkBarcode();
    },
    /* loadingWithOutBarCode: function (newValue) {
      if (newValue == true) {
      }
    }, */
  },
  methods: {
    ...mapActions({
      getBarcode: "offerings/barcode",
      getOfferingBarcode: "offerings/offeringBarcode",
      statusUndo: "offerings/statusUndo",
      statusReview: "offerings/statusReview",
      statusApprove: "offerings/statusApprove",
      statusPublish: "offerings/statusPublish",
      statusFreez: "offerings/statusFreez",
      UpdateStudentTermGrades: "controlStudents/UpdateStudentTermGrades",
      updateBarcode: "offerings/updateBarcode",
    }),
    init(query) {
      //this.loadingWithOutBarCode = false;
      this.show = true;
      this.getOfferingBarcode(this.$route.params.id).then((offeringData) => {
        this.offeringData = offeringData;
        this.status = offeringData.status;
        this.offeringMaxTotal=offeringData.max_total
        if (offeringData.offering_marks) {
          let exams = [];
          offeringData.offering_marks.forEach((exam) => {
            if (exam.pivot && exam.is_final == 1) {
              exams.push(exam.pivot);
            }
          });
          this.examsFilter = exams;
        }
      });
      let payload = { offering_id: this.$route.params.id, query: query };
      this.getBarcode(payload).then((response) => {
        if (response.meta) {
          this.total = response.meta.count ? response.meta.count : 0;
        }
        if (response.data) {
          this.items = response.data;
          //this.examsFilter=data.offering_marks? data.offering_marks:[]
          this.filteredItems = response.data;
          this.studentsBarcodes = response.data;
          this.checkStudentsBarcodes;
          /*  if (data.offering_marks) {
              let exams = [];
              data.offering_marks.forEach((exam) => {
                if (exam.pivot && exam.is_final == 1) {
                  exams.push(exam.pivot);
                }
              });
              this.examsFilter = exams;
            } */
          if (this.studentsBarcodes) {
            this.studentsBarcodes.forEach((student) => {
              if (
                student.registration &&
                student.registration.registration_marks
              ) {
                let db = {};
                let totalValue = 0;
                //let maxMark = 0;
                let percentageValue = 0;
                student.registration.registration_marks.forEach((mark) => {
                  if (
                    mark.name != "barcode" &&
                    mark.name != "total" &&
                    mark.name != "max_total" &&
                    mark.name != "percentage" &&
                    mark.name != "gpa" &&
                    mark.name != "grade" &&
                    mark.name != "actions"
                  ) {
                    if (mark.pivot) {
                      student[mark.name] = mark.pivot.value != null
                        ? mark.pivot.value
                        : null;
                      totalValue += mark.pivot.value ? mark.pivot.value : 0;
                      //maxMark += mark.max_mark ? mark.max_mark : 0;
                      student["total"] = totalValue;
                      student["max_total"] = this.offeringMaxTotal > 0 ? this.offeringMaxTotal : 0;
                    }
                  }
                });
                percentageValue =
                  totalValue >= 0 && this.offeringMaxTotal > 0
                    ? (totalValue / this.offeringMaxTotal) * 100
                    : null;
                //show 3 decimal numbers after . in percentage
                student["percentage"] =
                  percentageValue != null
                    ? percentageValue
                        .toString()
                        .match(/^-?\d+(?:\.\d{0,3})?/)[0] + "%"
                    : null;
              }
            });
          }
        }
        //this.loadingWithOutBarCode = true;
      });
      this.show = false;
    },
    checkBarcode() {
      if (this.barcode) {
        let filteredBarcode = [];
        this.studentsBarcodes.forEach((data) => {
          if (data.barcode == this.barcode) {
            filteredBarcode.push(data);
          }
        });
        this.filteredItems = filteredBarcode;
      } else {
        this.init();
      }
    },
    checkGrade() {},
    reset() {
      this.exams = null;
      this.barcode = null;
      this.grade = null;
      this.init();
    },
    reviewStatus() {
      this.$swal({
        title:
          this.$i18n.locale == "en"
            ? "Are you sure you want to (Review)"
            : "هل أنت متأكد أنك تريد (المراجعة)",
        text:
          this.$i18n.locale == "en"
            ? "Important! you will not be able to change the grades again unless you contact control member with higher permission to reopen the grades editing for you."
            : "مهم! لن تتمكن من تغيير التقديرات مرة أخرى إلا إذا اتصلت باحد اعضاء الكنترول بسماحية اعلي لإعادة فتح تعديل الدرجات لك  ",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.ok")}`,
        customClass: {
          title: "test",
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.statusReview(this.id).then((response) => {
            if (response.success) {
              this.$swal({
                type: "success",
                icon: "success",
                showConfirmButton: false,
                timer: 5000,
              });
              this.init();
            } else {
              this.$swal({
                type: "error",
                text: response.error,
                icon: "error",
                showConfirmButton: true,
                timer: 5000,
              });
            }
          });
          this.init();
        }
      });
    },
    approveStatus() {
      this.$swal({
        title:
          this.$i18n.locale == "en"
            ? "Are you sure you want to (Approve)"
            : "هل أنت متأكد أنك تريد (الاعتماد)",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.ok")}`,
        customClass: {
          title: "test",
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.statusApprove(this.id).then((response) => {
            if (response.success) {
              this.$swal({
                type: "success",
                //text: response.success,
                icon: "success",
                showConfirmButton: false,
                timer: 5000,
              });
              this.init();
            } else {
              this.$swal({
                type: "error",
                text: response.error,
                icon: "error",
                showConfirmButton: true,
                timer: 5000,
              });
            }
          });
          this.init();
        }
      });
    },
    publishStatus() {
      this.$swal({
        title:
          this.$i18n.locale == "en"
            ? "Are you sure you want to (Publish)"
            : "هل أنت متأكد أنك تريد (النشر)",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.ok")}`,
        customClass: {
          title: "test",
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.statusPublish(this.id).then((response) => {
            if (response.success) {
              this.$swal({
                type: "success",
                //text: response.success,
                icon: "success",
                showConfirmButton: false,
                timer: 5000,
              });
              this.init();
            } else {
              this.$swal({
                type: "error",
                text: response.error,
                icon: "error",
                showConfirmButton: true,
                timer: 5000,
              });
            }
          });
          this.init();
        }
      });
    },
    freezeStatus() {
      this.$swal({
        title:
          this.$i18n.locale == "en"
            ? "Are you sure you want to (Freeze)"
            : "هل أنت متأكد أنك تريد (تجميد)",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.ok")}`,
        customClass: {
          title: "test",
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.statusFreez(this.id).then((response) => {
            if (response.success) {
              this.$swal({
                type: "success",
                // text: response.success,
                icon: "success",
                showConfirmButton: false,
                timer: 5000,
              });
              this.init();
            } else {
              this.$swal({
                type: "error",
                text: response.error,
                icon: "error",
                showConfirmButton: true,
                timer: 5000,
              });
            }
          });
          this.init();
        }
      });
    },
    undoStatus() {
      this.$swal({
        title:
          this.$i18n.locale == "en"
            ? "Are you sure you want to (Undo)"
            : "هل أنت متأكد أنك تريد (الرجوع)",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.ok")}`,
        customClass: {
          title: "test",
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.statusUndo(this.id).then((response) => {
            if (response.success) {
              this.$swal({
                type: "success",
                icon: "success",
                showConfirmButton: false,
                timer: 5000,
              });
              // this.status = this.items.status ? this.item.status :'';
              // window.location.reload();
              this.init();
              //  window.setTimeout(history.go(0), 6000);
            } else {
              this.$swal({
                type: "error",
                text: response.error,
                icon: "error",
                showConfirmButton: true,
                timer: 5000,
              });
            }
          });
          this.init();
        }
      });
    },
    openGradesDialog(data) {
      let arr = [];
      if (data.registration_marks && data.registration_marks.length > 0) {
        data.registration_marks.forEach((mark) => {
          let arr_db = {};
          arr_db.id = mark.id;
          arr_db.name = mark.name;
          arr_db.value = mark.pivot.value;
          arr_db.max = mark.max_mark;

          arr_db.offering_mark_id = mark.pivot.offering_mark_id;
          arr_db.registration_id = mark.pivot.registration_id;

          arr.push(arr_db);
        });
      }
      this.termCoursesMarks = arr;
      this.grades_dialog = true;
    },
    checkMarks() {
      if (this.termCoursesMarks) {
        this.termCoursesMarks.forEach((mark) => {
          if (mark.value > mark.max) {
            this.$swal({
              icon: "error",
              title:
                this.$i18n.locale === "en" ? "Wrong In Mark" : "خطا في الدرجة",
              text:
                this.$i18n.locale === "en"
                  ? "Mark Exceeded the Maximum Value"
                  : " الدرجة تخطت القيمة العظمي",
              showConfirmButton: false,
              timer: 3000,
            });
            //mark.value = null
          }
        });
      }
    },
    submit_grades() {
      ///////////////////////////////////////////////
      //check if marks is greater than maximaum or not
      let maximumFlag = false
      if (this.termCoursesMarks) {
        this.termCoursesMarks.forEach((mark) => {
          if (mark.value > mark.max) {
            maximumFlag = true
            this.$swal({
              icon: "error",
              title:
                this.$i18n.locale === "en" ? "Wrong In Mark" : "خطا في الدرجة",
              text:
                this.$i18n.locale === "en"
                  ? "Mark Exceeded the Maximum Value"
                  : " الدرجة تخطت القيمة العظمي",
              showConfirmButton: false,
              timer: 3000,
            });
          }

          //////////////////////////////////////////////
         /*  else {
            
          } */
        });
        if(maximumFlag == false)
          {
            let registrationMarks = [];

            if (this.termCoursesMarks) {
              this.termCoursesMarks.forEach((mark) => {
                let db = {};
                db.offering_mark_id = mark.offering_mark_id;
                db.registration_id = mark.registration_id;
                db.value = mark.value;

                registrationMarks.push(db);
              });
            }
            let payload = {
              registrationMarks: JSON.stringify(registrationMarks),
              registration: registrationMarks[0].registration_id,
            };
            this.UpdateStudentTermGrades(payload)
              .then((response) => {
                this.show = true;
                if (response.status && response.status === "success") {
                  this.$swal({
                    icon: "success",
                    title: `${this.$t("Global.saved")}`,
                    showConfirmButton: false,
                    timer: 2000,
                  });
                  this.init();
                  this.grades_dialog = false;
                } else {
                }
              })
              .catch((error) => {
                let message =
                  error.response.data.errors.length > 0
                    ? error.response.data.errors[0].title
                    : this.$t("Global.errorMessage");
                this.$swal({
                  icon: "error",
                  text: message,
                  showConfirmButton: true,
                  timer: 3000,
                });
              });
              this.show = false
          }
      }
    },
    refresh(query = {}) {
      //this.show=true
      /*  this.getOfferingBarcode(this.$route.params.id).then(offeringData => {
        this.offeringData=offeringData
        this.status = offeringData.status;
         if (offeringData.offering_marks) {
            let exams = [];
            offeringData.offering_marks.forEach((exam) => {
              if (exam.pivot && exam.is_final == 1) {
                exams.push(exam.pivot);
              }
            });
            this.examsFilter = exams;
          }
      }) */
      let payload = { offering_id: this.$route.params.id, query: query };
      this.getBarcode(payload).then((response) => {
        if (response.meta) {
          this.total = response.meta.count ? response.meta.count : 0;
        }
        if (response.data) {
          this.items = response.data;
          //this.examsFilter=data.offering_marks? data.offering_marks:[]
          this.filteredItems = response.data;
          this.studentsBarcodes = response.data;
          this.checkStudentsBarcodes;
          /*  if (data.offering_marks) {
              let exams = [];
              data.offering_marks.forEach((exam) => {
                if (exam.pivot && exam.is_final == 1) {
                  exams.push(exam.pivot);
                }
              });
              this.examsFilter = exams;
            } */
          if (this.studentsBarcodes) {
            this.studentsBarcodes.forEach((student) => {
              if (
                student.registration &&
                student.registration.registration_marks
              ) {
                let db = {};
                let totalValue = 0;
                //let maxMark = 0;
                let percentageValue = 0;
                student.registration.registration_marks.forEach((mark) => {
                  if (
                    mark.name != "barcode" &&
                    mark.name != "total" &&
                    mark.name != "max_total" &&
                    mark.name != "percentage" &&
                    mark.name != "gpa" &&
                    mark.name != "grade" &&
                    mark.name != "actions"
                  ) {
                    if (mark.pivot) {
                      student[mark.name] = mark.pivot.value != null
                        ? mark.pivot.value
                        : null;
                      totalValue += mark.pivot.value != null ? mark.pivot.value : 0;
                      //maxMark += mark.max_mark ? mark.max_mark : 0;
                      student["total"] = totalValue;
                      student["max_total"] = this.offeringMaxTotal >0 ? this.offeringMaxTotal : 0;
                    }
                  }
                });
                percentageValue =
                  totalValue >= 0 && this.offeringMaxTotal > 0
                    ? (totalValue / this.offeringMaxTotal) * 100
                    : null;
                //show 3 decimal numbers after . in percentage
                student["percentage"] =
                  percentageValue != null
                    ? percentageValue
                        .toString()
                        .match(/^-?\d+(?:\.\d{0,3})?/)[0] + "%"
                    : null;
              }
            });
          }
        }
      });
      this.show = false;
    },
    updateGradeBarcode() {
      let registrationMarks = [
        {
          barcode: this.barcode,
          offering_mark_id: this.exams,
          value: this.grade,
        },
      ];
      //let registrationMarks = {barcode : this.barcode,offering_mark_id: ''}
      let payload = {
        id: this.$route.params.id,
        query: { registrationMarks: JSON.stringify(registrationMarks) },
      };
      this.updateBarcode(payload)
        .then((response) => {
          if (response.status && response.status === "success") {
            this.$swal({
              icon: "success",
              title: `${this.$t("Global.saved")}`,
              showConfirmButton: false,
              timer: 2000,
            });
            //this.refresh()
            this.show = true;
            //this.checkBarcode()
            if (this.barcode) {
              let query = {}
              this.refresh();
            }
            this.show = false;
          } else {
          }
        })
        .catch((error) => {
          let message =
            error.response.data.errors.length > 0
              ? error.response.data.errors[0].title
              : this.$t("Global.errorMessage");
          this.$swal({
            icon: "error",
            text: message,
            showConfirmButton: true,
            timer: 3000,
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
.tdcustom{
  background-color:#3981e73d;
}
</style>
