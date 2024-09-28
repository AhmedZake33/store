<template>
  <b-overlay
      v-if="loading != -1"
      :show="loading"
      rounded="sm"
  >
    <div v-if="!loading">
      <b-col cols="12">
        <b-card
            class="mb-0"
            :title="$t('Student Transfer')"
        >
          <b-row>
            <b-col cols="7">
              <b-badge class="ml-1" pill :variant="`light-primary`">
                {{ getTranslatedName(transfer_detalis.type) }}
              </b-badge>
              <span v-if="transfer_detalis &&  transfer_detalis.status && transfer_detalis.status.id">
                        <b-badge class="ml-1" v-if="transfer_detalis.status.id==1" pill :variant="`light-primary`">
                            {{ getTranslatedName(transfer_detalis.status) }}
                        </b-badge>
                        <b-badge class="ml-1" v-if="transfer_detalis.status.id==2" pill :variant="`light-secondary`">
                            {{ getTranslatedName(transfer_detalis.status) }}
                        </b-badge>
                        <b-badge class="ml-1" v-if="transfer_detalis.status.id==3" pill :variant="`light-success`">
                            {{ getTranslatedName(transfer_detalis.status) }}
                        </b-badge>
                        <b-badge class="ml-1" v-if="transfer_detalis.status.id==4" pill :variant="`light-danger`">
                            {{ getTranslatedName(transfer_detalis.status) }}
                        </b-badge>
                    </span>


              <div class="mt-1 ml-1">
                <div>{{ moment(transfer_detalis.created_at).utc().format('YYYY-MM-DD HH:MM:SS') }}</div>
                <span>
                  <b-link :to="{ name: 'faculty', params: { id: transfer_detalis.faculty.id } }" class="font-weight-bold">
                    {{ getTranslatedName(transfer_detalis.faculty) }}
                  </b-link>
                  <strong class="text-danger"> , </strong>
                  <b-link :to="{ name: 'bylaw', params: { id: transfer_detalis.bylaw.id } }" class="font-weight-bold">
                    {{ getTranslatedName(transfer_detalis.bylaw) }}
                  </b-link>
                  <strong class="text-danger"> , </strong>
                  <b-link :to="{ name: 'program', params: { id: transfer_detalis.program.id } }" class="font-weight-bold">
                    {{ getTranslatedName(transfer_detalis.program) }}
                  </b-link>
                </span>
              </div>

              <div class="mt-1 ml-1">
                <b-link
                    :to="{name:'student-show',
                            params: { id: studentId }
                            }"
                >
                  {{ student.student_code }} :
                </b-link>
                {{ ($i18n.locale == 'en' ? student.student_name.name : student.student_name.name_local) }}

              </div>
            </b-col>
            <b-col cols="5">
              <b-row v-if="transfer_detalis.type.id != 1">

                <b-col>
                  <b>{{ $t('Hours') }}: </b>
                  <b-badge
                      variant="primary"
                      cols="2"
                      style="padding: 10px"
                  >
                    {{ courses_hours }}
                  </b-badge>
                </b-col>
                <b-col>
                  <b>{{ $t('courses') }}: </b>
                  <b-badge
                      variant="primary"
                      style="padding: 10px"
                      cols="2"
                  >
                    {{ count_courses }}
                  </b-badge>
                </b-col>
              </b-row>

            </b-col>

          </b-row>

        </b-card>
      </b-col>

      <b-col cols="12" class="mt-1">
        <b-card
            class="mb-0"
        >
          <b-row>
            <b-col>
              <div><strong>{{ $t('Study Plan') }} </strong> :
                <b-link
                    :to="{ name: 'faculty', params: { id: student.from.student_faculty.id } }"
                    class="font-weight-bold">
                  {{ getTranslatedNameFromObject(student.from.student_faculty) }}
                </b-link>
                <strong class="text-danger"> , </strong>

                <b-link :to="{ name: 'bylaw', params: { id: student.from.student_bylaw.id } }"
                        class="font-weight-bold">
                  {{ getTranslatedNameFromObject(student.from.student_bylaw) }}
                </b-link>
                <strong class="text-danger"> , </strong>
                <b-link :to="{ name: 'program', params: { id: student.from.student_program.id } }"
                        class="font-weight-bold">
                  {{ getTranslatedNameFromObject(student.from.student_program) }}
                </b-link>

              </div>
              <div>
                <strong>{{ $t('Level') }} </strong> : {{ getTranslatedNameFromObject(student.student_level) }}
              </div>
              <div>
                <strong>{{ $t('Term') }}</strong> : {{ getTranslatedNameFromObject(student.student_term) }}
              </div>

            </b-col>
          </b-row>
        </b-card>
      </b-col>

      <!-- to select courses  -->
      <b-col cols="12" class="mt-1" v-if="transfer_detalis.type.id == 2 || transfer_detalis.type.id == 3">
        <b-card :title="$t('Student Courses')" class="mb-0">
          <b-table
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
            <template #cell(code)="data">
                            <span>
                                {{ data.item.code }}
                            </span>
            </template>
            <template #cell(name)="data">
              <b-link :to="{ name: 'course', params: { id: data.item.id } }"
                      class="font-weight-bold">
                {{ $i18n.locale == 'en' ? data.item.name : data.item.name_local }}
              </b-link>

              <div v-if="data.item.temp.length >0">
                <strong class="text-secondary" style="font-size:12.5px;">{{ $t('Equivalized Courses') }} : </strong><br>
                <div style="font-size:10px;" v-for="course in data.item.temp" :key="course.course.id">
                  &nbsp;&nbsp;&nbsp;<b-link :to="{ name: 'course', params: { id: course.course.id } }"
                                            class="font-weight-bold">
                  {{ course.course.code }} - {{ getTranslatedName(course.course) }}
                </b-link>
                  - {{ course.total }}/{{ course.max_total }}
                </div>


              </div>
            </template>


            <template #cell(actions)="data">
              <div style="flex-direction: column;gap: 0em">
                <!-- v-if="transfer_detalis && transfer_detalis.status && transfer_detalis.status.id==2 && hasPermission('equivalize_courses_internalTransfer')" -->
                <div>

                  <b-button
                      v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                      v-b-modal.modal-prevent-closing
                      variant="outline-primary"
                      size="sm"
                      @click="selectTransferCourse(data.item)"
                  >
                    {{ $t('Select') }}
                  </b-button>

                </div>
              </div>
            </template>
          </b-table>
          <b-modal hide-footer id="modal_success" v-model="dialog" no-close-on-backdrop size="lg"
                   :title="$t('Avalible Courses')">
            <programCourses @RefreshParent="init" :programId="programId" :relatedCourseId="relatedCourseId"
                            @hideModal="hideModal()"></programCourses>
          </b-modal>

        </b-card>

      </b-col>
      <b-col cols="6" md="3" class="mt-1"
             v-if="transfer_detalis && transfer_detalis.status && transfer_detalis.status.id==2">
        <div v-if="transfer_detalis.type.id==1">
          <b-button
              v-if="hasPermission('apply_program_internalTransfer')"
              class="btn-icon mr-1 small"
              variant="primary"
              @click="applyTransfer()"
          >
            {{ $t('Transfer') }}
          </b-button>
          <b-button
              v-if="hasPermission('reject_program_internalTransfer')"
              class="btn-icon mr-1 small"
              variant="primary"
              @click="openRejectDialog()"
          >
            {{ $t('Reject') }}
          </b-button>
        </div>
        <div v-if="transfer_detalis.type.id==2">
          <b-button
              v-if="hasPermission('apply_bylaw_internalTransfer')"
              class="btn-icon mr-1 small"
              variant="primary"
              @click="applyTransfer()"
          >
            {{ $t('Transfer') }}
          </b-button>
          <b-button
              v-if="hasPermission('reject_bylaw_internalTransfer')"
              class="btn-icon mr-1 small"
              variant="danger"
              @click="openRejectDialog()"
          >
            {{ $t('Reject') }}
          </b-button>
        </div>
        <div v-if="transfer_detalis.type.id==3">
          <b-button
              v-if="hasPermission('apply_faculty_internalTransfer')"
              class="btn-icon mr-1 small"
              variant="primary"
              @click="applyTransfer()"
          >
            {{ $t('Transfer') }}
          </b-button>
          <b-button
              v-if="hasPermission('reject_faculty_internalTransfer')"
              class="btn-icon mr-1 small"
              variant="danger"
              @click="openRejectDialog()"
          >
            {{ $t('Reject') }}
          </b-button>
        </div>

      </b-col>
      <b-modal id="modalPopover" v-model="rejectDialog" no-close-on-backdrop size="md" :title="$t('Reject Transfer')">
        <validation-observer ref="rejectForm">
          <b-form>
            <div class="row">
              <b-col md="12">
                <b-form-group :label="$t('Reject Reason')" label-for="reject-reason" invalid-feedback="">
                  <validation-provider #default="{ errors }" name="reject-reason" rules="required">
                    <b-form-textarea id="name-input" c v-model="reject_reason"
                                     :state="errors.length > 0 ? false : null"/>
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
            </div>
          </b-form>
        </validation-observer>
        <template #modal-footer>
          <b-row>
            <b-col md="12">
              <b-button type="submit" variant="primary" class="mr-1" @click="rejectTransferRequest()">
                {{ $t('Global.save') }}
              </b-button>
              <b-button type="reset" variant="danger" @click="rejectDialog = false">
                {{ $t('Global.cancel') }}
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
  BFormTextarea
} from "bootstrap-vue";
import {mapGetters, mapActions} from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import DataTable from "@/views/components/table/DataTable";
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue';
import {ValidationProvider, ValidationObserver, localize} from 'vee-validate';
import {required, between} from '@validations';
import programCourses from "@/views/students/student/transfer/components/program_courses.vue"

export default {
  name: 'Transfer',
  components: {
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
    programCourses

  },
  directives: {
    Ripple,
  },

  data() {
    return {
      transferId: null,
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
      relatedCourseId: null
    }
  },
  computed: {
    id() {
      return this.$route.params.student_id ? this.$route.params.student_id : null
    },
    transfer_id() {
      return this.$route.params.transfer_id ? this.$route.params.transfer_id : null
    },
    locale() {
      return this.$i18n.locale == 'ar' ? 'ar-EG' : 'en-US';
    },
    query() {
      const data = {
        faculties: true,

      };
      return data;
    },
    selectorFields() {
      return [
        {
          key: 'code',
          label: this.$t('code'),
          sortable: false,
        },
        {
          key: 'name',
          label: this.$t('name'),
          sortable: false,
        },
        {
          key: 'credit_hours',
          label: this.$t('credit_hours'),
          sortable: false,
        },
        {
          key: 'total',
          label: this.$t('Total'),
          sortable: false,
        },
        {
          key: 'max_total',
          label: this.$t('Max Total'),
          sortable: false,
        },
        {
          key: 'gpa',
          label: this.$t('GPA'),
          sortable: false,
        },
        {
          key: 'actions',
          label: this.$t('actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ]
    },

    ...mapGetters({}),
  },
  mounted() {
    this.studentId = this.id;
    this.transferId = this.transfer_id
    if (this.transferId) {
      this.init()
    }
  },
  methods: {
    ...mapActions({
      getStudentData: 'internalTransfer/getInternalStudentData',
      getTransferAvailableCourses: 'internalTransfer/getTransferAvailableCourses',
      getTransferTempCourses: 'internalTransfer/getTransferTempCourses',
      getLookups: 'app/GET_LOOKUPS',
      executeStudentTransfer: 'internalTransfer/executeStudentTransfer',
      getTransferDetails: 'internalTransfer/getTransferDetails',
      rejectTransfer: 'internalTransfer/rejectTransferRequest'


    }),
    openDialog(data) {
      this.dialog = true;

      this.course.id = data.id
      this.course.code = data.code
      this.course.name = data.name
      this.course.name_local = data.name_local
      this.course.bylaw_id = data.bylaw_id
      this.course.max_total = data.max_total
      this.course.credit_hours = data.credit_hours


    },
    openRejectDialog() {
      this.rejectDialog = true;
    },

    refreshAvailableCourses(query) {
      if (this.filter) {
        query = {...query, ...this.filter}
      }
      // to store query and use it again after update table in add and drop
      this.availableCoursesQuery = query

      this.availableCoursesLoad = true

      this.getTransferAvailableCourses({id: this.transferId}).then(data => {
        this.equivalent_courses = data.data
        this.availableCoursesLoad = false

      })
    },
    selectTransferCourse(data) {
      this.relatedCourseId = data.course_id
      this.openDialog(data)
    },

    init() {
      this.courses_hours = 0;
      this.count_courses = 0;
      this.loading = true
      this.getTransferDetails({transfer_id: this.transferId}).then(data => {
        this.transfer_detalis = data.data;
        this.programId = data.data.program_id
        if (data.data.type.id == 2 || data.data.type.id == 3) {
          this.getTransferAvailableCourses({id: this.transferId}).then(d => {
            this.equivalent_courses = d.data
            this.availableCoursesLoad = false

          })
        }

      })
      this.getStudentData({id: this.transferId}).then(data => {
        this.student = data.details

        this.getTransferTempCourses(this.transferId).then(data => {
          this.courses = data.courses_selected

          if (this.courses.length > 0) {
            let numerator = 0
            let denominator = 0
            this.courses.forEach(el => {
              // numerator += (el['gpa']*el['credit_hours'])
              // denominator += el['credit_hours']
              this.count_courses++
              this.courses_hours += el['credit_hours']
            });
            // this.student_gpa = Math.round((numerator / denominator) * 100) / 100
          }


        })
        // to load breadcrump student code
        if (this.id) {
          this.$store.commit('app/UPDATE_PAGE_DETAILS', {name:this.student.student_name.name,name_local: this.student.student_name.name_local }, {root: true});
        }

        this.loading = false
      }).catch(error => {

      });

    },
    applyTransfer() {
      this.executeStudentTransfer({id: this.transfer_id}).then(data => {
        if (data.status === 'success') {
          this.successToast(this.$i18n.locale == 'ar' ? data.message.ar : data.message.en)
          this.loading = true
          this.$router.go(-1)


        }
      }).catch(error => {
        this.errorToast(error.title)
      })
    },

    rejectTransferRequest() {
      this.$nextTick(_ => {
        this.$refs.rejectForm
            .validate()
            .then(success => {
              if (success) {
                const payload = {transfer_id: this.transfer_id, query: {reject_reason: this.reject_reason}}
                this.rejectTransfer(payload).then(data => {
                  if (data.status === 'success') {
                    this.successToast(this.$i18n.locale == 'ar' ? data.message.ar : data.message.en)
                    this.loading = true
                    this.$router.go(-1)


                  }
                }).catch(error => {
                  this.errorToast(error.title)
                })
              }
              ;

            });
      })

    },
    hideModal() {
      this.dialog = false;
      this.$router.replace({}, () => {
      },)

    },
  }

}
</script>
<style>
/* .input-group {

     margin-left: 121px;
} */
</style>
