<template>
  <div>
    <b-card class="mb-0">
      <b-tabs
        lazy
        vertical
        nav-wrapper-class="nav-hidden"
        align="left"
      >
        <b-tab v-if="hasPermission('access_admission_fees')">
          <template #title>
            <feather-icon icon="DollarSignIcon" />
            <span>{{ $t('undergraduate_admission_fees') }}</span>
          </template>
          <AdmissionFees :admission-type="'admission-fees-ug'" :yearId="id" />
        </b-tab>
        <b-tab v-if="hasPermission('access_admission_fees')">
          <template #title>
            <feather-icon icon="DollarSignIcon" />
            <span>{{ $t('postgraduate_admission_fees') }}</span>
          </template>
          <AdmissionFees :admission-type="'admission-fees-pg'" :yearId="id" />
        </b-tab>
        <b-tab v-if="hasPermission('access_tuition_fees')">
          <template #title>
            <feather-icon icon="DollarSignIcon" />
            <span>{{ $t('undergraduate_tuition_fees') }}</span>
          </template>
          <TuitionFees :tuition-type="'tuition-fees-ug'" :yearId="id" />
        </b-tab>
        <b-tab v-if="hasPermission('access_tuition_fees')">
          <template #title>
            <feather-icon icon="DollarSignIcon" />
            <span>{{ $t('spring_undergraduate_tuition_fees') }}</span>
          </template>
          <SpringTuitionFees :tuition-type="'spring-tuition-fees-ug'" :yearId="id" />
        </b-tab>
       
        <b-tab v-if="hasPermission('access_tuition_fees')">
          <template #title>
            <feather-icon icon="DollarSignIcon" />
            <span>{{ $t('postgraduate_tuition_fees') }}</span>
          </template>
          <TuitionFees :tuition-type="'tuition-fees-pg'" :yearId="id" />
        </b-tab>
        <b-tab v-if="hasPermission('access_tuition_fees')">
          <template #title>
            <feather-icon icon="DollarSignIcon" />
            <span>{{ $t('spring_postgraduate_tuition_fees') }}</span>
          </template>
          <SpringTuitionFees :tuition-type="'spring-tuition-fees-pg'" :yearId="id" />
        </b-tab>
        <b-tab v-if="hasPermission('access_tuition_fees')">
          <template #title>
            <feather-icon icon="DollarSignIcon" />
            <span>{{ $t('summer_undergraduate_tuition_fees') }}</span>
          </template>
          <SummerTuitionFees :tuition-type="'summer-tuition-fees-ug'" :yearId="id" />
        </b-tab>
        <b-tab v-if="hasPermission('access_tuition_fees')">
          <template #title>
            <feather-icon icon="DollarSignIcon" />
            <span>{{ $t('summer_postgraduate_tuition_fees') }}</span>
          </template>
          <SummerTuitionFees :tuition-type="'summer-tuition-fees-pg'" :yearId="id" />
        </b-tab>
        <b-tab v-if="hasPermission('access_dueDates')">
          <template #title>
            <feather-icon icon="DollarSignIcon" />
            <span>{{ $t('Global.due_dates') }}</span>
          </template>
          <DueDates  :yearId="id" />
        </b-tab>
        <!-- <b-tab v-if="hasPermission('access_tuition_fees')">
          <template #title>
            <feather-icon icon="DollarSignIcon" />
            <span>{{ $t('undergraduate_tuition_deadline') }}</span>
          </template>
          <TuitionFeesDeadline :tuition-type="'tuition-fees-pg'" :yearId="id" />
        </b-tab>
        <b-tab v-if="hasPermission('access_tuition_fees')">
          <template #title>
            <feather-icon icon="DollarSignIcon" />
            <span>{{ $t('postgraduate_tuition_deadline') }}</span>
          </template>
          <TuitionFeesDeadline :tuition-type="'tuition-fees-pg'" :yearId="id" />
        </b-tab> -->
        <b-tab  v-if="hasPermission('access_certificateSetting')">
          <template #title>
            <feather-icon icon="DollarSignIcon" />
            <span>{{ $t('certificate_settings') }}</span>
          </template>
          <CertificateFees :yearId="id" />
        </b-tab>
        <b-tab v-if="hasPermission('access_hotel_fees')">
          <template #title>
            <feather-icon icon="DollarSignIcon" />
            <span>{{ $t('hotel_fees') }}</span>
          </template>
          <HotelFees :yearId="id" />
        </b-tab>
        <b-tab v-if="hasPermission('access_services_fees')">
          <template #title>
            <feather-icon icon="DollarSignIcon" />
            <span>{{ $t('services_fees') }}</span>
          </template>
          <ServicesFees :yearId="id" />
        </b-tab>
        <b-tab :title-item-class="'custom_underline'" v-if="hasPermission('access_other_services_fees')">
          <template #title>
            <feather-icon icon="DollarSignIcon" />
            <span>{{ $t('other_services_fees') }}</span>
          </template>
          <OtherServicesFees :yearId="id" />
        </b-tab>
        <b-tab v-if="hasPermission('access_settings_scholarship')">
          <template #title>
            <feather-icon icon="DollarSignIcon" />
            <span>{{ $t('Scholarships') }}</span>
          </template>
          <Scholarships :yearId="id" />
        </b-tab>
        <b-tab v-if="hasPermission('access_accounting_items')">
          <template #title>
            <feather-icon icon="DollarSignIcon" />
            <span>{{ $t('Accounts_Settings_items') }}</span>
          </template>
          <AccountingItems :yearId="id" />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  BCard,
  BCol,
  BRow,
  BTab,
  BModal,
  BForm,
  BFormInput,
  BFormGroup,
  BInputGroup,
  BFormCheckbox,
  BFormDatepicker,
  BTabs,
  BButton,
  BCardBody,
  BCardHeader,
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import { required, email } from '@validations'
import vSelect from 'vue-select'
import ShowComponent from '@/views/components/info/show'
import Offerings from '@/views/study/offerings/components/offerings'
import Students from '@/views/students/student/components/students'
import Edit from '@/views/system/years/edit'
import Statistics from '@/views/components/info/statistics'
import TabTable from '@/views/students/student/components/TabTable'
import Terms from '@/views/system/years/components/terms'
import TuitionFees from '@/views/system/years/components/TuitionFees/TuitionFees'
import SpringTuitionFees from '@/views/system/years/components/TuitionFees/SpringTuitionFees'
import SummerTuitionFees from '@/views/system/years/components/TuitionFees/SummerTuitionFees'
import TuitionFeesDeadline from '@/views/system/years/components/TuitionFeesDeadline/TuitionFeesDeadline'
import AdmissionFees from '@/views/system/years/components/AdmissionFees/AdmissionFees'
import CertificatesSettings from '@/views/services_settings/certificates/index'
import AccountingItems from '@/views/system/years/components/AccountsSetting/Accounts'
import Scholarships from '@/views/system/years/components/ScholarshipsSetting/Scholarships'
import HotelFees from '@/views/system/years/components/Hotels/HotelFees'
import OtherServicesFees from '@/views/system/years/components/OtherServicesFees/ServicesFees'
import CertificateFees from '@/views/system/years/components/CertificateFees/CertificateFees'
import ServicesFees from '@/views/system/years/components/ServicesFees/ServicesFees'
import DueDates from '@/views/system/years/components/DueDates'

export default {
  name: 'Payment',
  components: {
    TuitionFees,
    SpringTuitionFees,
    SummerTuitionFees,
    Scholarships,
    TuitionFeesDeadline,
    Terms,
    TabTable,
    BFormDatepicker,
    Edit,
    Statistics,
    vSelect,
    BFormCheckbox,
    Students,
    Offerings,
    ShowComponent,
    BFormInput,
    BCard,
    BCol,
    BCardBody,
    BCardHeader,
    BModal,
    BForm,
    BFormGroup,
    BInputGroup,
    BRow,
    BTab,
    BTabs,
    BButton,
    ValidationProvider,
    ValidationObserver,
    localize,
    CertificatesSettings,
    AdmissionFees,
    ServicesFees,
    OtherServicesFees,
    HotelFees,
    CertificateFees,
    AccountingItems,
    DueDates
  },
  computed: {
    ...mapGetters({
      item: 'years/item',
      settings: 'settings/items',
      load: 'years/load',
      lookups: 'app/lookups',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null
    },

    certificate_sections() {
      if (this.lookups && this.lookups.certificates) {
        return this.lookups.certificates
      }
      return false
    },
    certificates() {
      if (this.lookups && this.lookups.certificates && this.settingForm.pre_university_certificate_groupe) {
        this.certificatesArray = this.lookups.certificates.find(el => el.id == this.settingForm.pre_university_certificate_groupe)
        return this.certificatesArray ? this.certificatesArray.pre_university_certificate : []
      }
    },
    certificate_types() {
      if (this.lookups && this.lookups.certificates && this.settingForm.pre_university_certificate && this.certificatesArray) {
        const certificateTypeArray = this.certificates ? this.certificates.find(el => el.id == this.settingForm.pre_university_certificate) : {}
        return certificateTypeArray ? certificateTypeArray.pre_university_certificate_type : []
      }
    },

    TERMFields() {
      return [
        {
          key: 'code',
          label: this.$t('Global.code'),
        },
        {
          key: 'name',
          label: this.$t('Global.name'),
        },
        {
          key: 'name_local',
          label: this.$t('Global.name_local'),
        },
        {
          key: 'start_date',
          label: this.$t('Global.start_date'),
        },
        {
          key: 'end_date',
          label: this.$t('Global.end_date'),
        },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ]
    },
    fields() {
      return [
        {
          key: 'faculty',
          label: this.$t('Global.faculty'),
        },
        {
          key: 'program',
          label: this.$t('Global.program'),
        },
        {
          key: 'minimum_grade',
          label: this.$t('Global.minimum_grade_current'),
        },
        {
          key: 'prev_minimum_grade',
          label: this.$t('Global.minimum_grade_prev'),
        },
        {
          key: 'stem_minimum_grade',
          label: this.$t('Global.stem_grade'),
        },
        {
          key: 'quota',
          label: this.$t('Global.student_quota'),
        },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ]
    },
    pg_fields() {
      return [
        {
          key: 'faculty',
          label: this.$t('Global.faculty'),
        },
        {
          key: 'program',
          label: this.$t('Global.program'),
        },
        // {
        //     key: 'minimum_grade',
        //     label: this.$t('Global.minimum_grade_current'),
        // },
        {
          key: 'quota',
          label: this.$t('Global.student_quota'),
        },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ]
    },
    enrollmentFields() {
      return [
        {
          key: 'faculty',
          label: this.$t('Global.faculty'),
          thStyle: { width: '10%' },
        },
        {
          key: 'bylaw',
          label: this.$t('Global.bylaw'),
        },
        {
          key: 'registration',
          label: this.$t('Global.registration'),
        },
        {
          key: 'add_drop',
          label: this.$t('Global.add'),
        },
        {
          key: 'drop',
          label: this.$t('Global.drop'),
        },
        {
          key: 'withdraw',
          label: this.$t('Global.withdraw'),
        },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ]
    },
    locale() {
      return this.$i18n.locale == 'ar' ? 'ar-EG' : 'en-US'
    },
    minDate() {
      if (!this.term_form.start_date) return
      const last = this.term_form.start_date.charAt(this.term_form.start_date.length - 1)
      const beforeLast = this.term_form.start_date.charAt(this.term_form.start_date.length - 2)
      const addDay = Number(last) + 1
      if (beforeLast == 3 && last == 0) {
        const month = this.term_form.start_date.charAt(this.term_form.start_date.length - 4)
        const increase = Number(month) + 1
        const text = `${this.term_form.start_date.slice(0, -4) + increase}-${1}`
        return text
      }
      const text = this.term_form.start_date.slice(0, -1) + addDay
      return text
    },
  },
  data() {
    return {
      edit: false,
      dialog: false,
      term_dialog: false,
      students_pg_dialog: false,
      is_usd: 3,
      is_pg: false,
      enroll_dialog: false,
      pg_dialog: false,
      students_dialog: false,
      form: { faculty_id: null, program_id: null },
      term_form: { start_date: null, end_date: null },
      certificatesArray: [],
      ruleForm: {
        // min_gpa: null,
        registration_date_from: null,
        registration_date_to: null,
        adddrop_date_from: null,
        adddrop_date_to: null,
        withdraw_date_from: null,
        withdraw_date_to: null,
        drop_date_from: null,
        drop_date_to: null,
        faculty_id: null,
        bylaw_id: null,
      },
      settingForm: {
        minimum_grade: null,
        quota: null,
      },
      options_langs: [
        { text: 'arabic', value: false },
        { text: 'english', value: false },
        { text: 'french', value: false },
        { text: 'german', value: false },
        { text: 'italy', value: false },
        { text: 'math', value: false },
        { text: 'advanced_math', value: false },
        { text: 'biology', value: false },
        { text: 'chemistry', value: false },
        { text: 'physics', value: false },
      ],
      errorsdata: {},
      pgRuleForm: {
        total: 0,
        total_usd: 0,
        second_year: 0,
        first_year: 0,
        third_year: 0,
        second_usd_year: 0,
        first_usd_year: 0,
        third_usd_year: 0,
        degree: null,
        application_fess: null,
      },
      settings_id: null,
      term_id: null,
      endDateState: null,
      startDateState: null,
      value: '',
      showDecadeNav: false,
      hideHeader: false,
      locales: [
        { value: 'en-US', text: 'English US (en-US)' },
        { value: 'ar-EG', text: 'Arabic Egyptian (ar-EG)' },
      ],
      weekday: 0,
      weekdays: [
        { value: 0, text: 'Sunday' },
        { value: 1, text: 'Monday' },
        { value: 6, text: 'Saturday' },
      ],
      labels: {
        'ar-EG': {
          labelPrevDecade: 'العقد السابق',
          labelPrevYear: 'العام السابق',
          labelPrevMonth: 'الشهر السابق',
          labelCurrentMonth: 'الشهر الحالي',
          labelNextMonth: 'الشهر المقبل',
          labelNextYear: 'العام المقبل',
          labelNextDecade: 'العقد القادم',
          labelToday: 'اليوم',
          labelSelected: 'التاريخ المحدد',
          labelNoDateSelected: 'لم يتم اختيار تاريخ',
          labelCalendar: 'التقويم',
          labelNav: 'الملاحة التقويم',
          labelHelp: 'استخدم مفاتيح المؤشر للتنقل في التواريخ',
        },
      },
    }
  },
  watch: {
    'form.faculty_id': function (val) {
      this.getLookups({
        faculty_id_programs: val,
        faculties: true,
        pre_certificates: true,
      })
    },
    'ruleForm.faculty_id': function (val) {
      this.getLookups({
        faculty_id: val,
        faculties: true,
        bylaws: true,
      })
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions({
      editTuitionFees: 'settings/put',
      removeSetting: 'settings/remove',
      getLookups: 'app/GET_LOOKUPS',
      addSetting: 'settings/enrollmentSetting',
    }),

    openEdit() {
      this.edit = true
      this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: true })
    },
    cancel() {
      this.edit = false
      this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: false })
    },

    getPrograms() {
      if (this.form.faculty_id) {
        const selectedPrograms = this.item.settings.filter(el => el.faculty.id == this.form.faculty_id)
        let programList
        if (this.lookups.programs && this.lookups.programs.length) {
          programList = this.lookups.programs.filter(program => selectedPrograms.every(f => f?.program?.id != program.id))
        }
        return programList
      }
    },
    submitStudents() {
      this.$nextTick(_ => {
        this.$refs.simpleRules2.validate().then(success => {
          if (success) {
            const type = { certificate_type: this.settingForm?.pre_university_certificate_type }
            delete this.ruleForm.pre_university_certificate_types
            delete this.ruleForm.pre_university_certificate_type
            const payload = {
              faculty_id: this.form.faculty_id,
              program_id: this.form.program_id,
              year_id: this.$route.params.id,
              name: 'ADMISSION_SETTINGS',
              value: { ...this.settingForm, ...type },
            }
            this.editTuitionFees({
              id: this.settings_id || null,
              query: payload,
            })
              .then(_ => {
                (this.dialog = false), (this.students_dialog = false), (this.grade_id = null)
                this.init()
                this.$swal({
                  icon: 'success',
                  title: `${this.$t('Global.saved')}`,
                  showConfirmButton: false,
                  timer: 2000,
                })
              })
              .catch(error => {
                this.grade_id = null
                this.$swal({
                  icon: 'error',
                  text: `${this.$t('Global.item_exist')}`,
                  showConfirmButton: false,
                  timer: 2000,
                })
              })
          }
        })
          .catch(error => {
            this.$swal({
              icon: 'error',
              text: `${this.$t('Global.errorMessage')}`,
              showConfirmButton: false,
              timer: 2000,
            })
          })
      })
    },
    submitStudentsPG() {
      this.$nextTick(_ => {
        this.$refs.simpleRules2.validate().then(success => {
          if (success) {
            const payload = {
              faculty_id: this.form.faculty_id,
              program_id: this.form.program_id,
              year_id: this.$route.params.id,
              name: 'PG_ADMISSION_SETTINGS',
              value: { ...this.settingForm },
            }
            this.editTuitionFees({
              id: this.settings_id || null,
              query: payload,
            }).then(_ => {
              (this.dialog = false), (this.students_pg_dialog = false)
              this.init()
              this.$swal({
                icon: 'success',
                title: `${this.$t('Global.saved')}`,
                showConfirmButton: false,
                timer: 2000,
              })
            })
              .catch(error => {
                this.grade_id = null
                this.$swal({
                  icon: 'error',
                  text: `${this.$t('Global.item_exist')}`,
                  showConfirmButton: false,
                  timer: 2000,
                })
              })
          }
        })
          .catch(error => {
            this.$swal({
              icon: 'error',
              text: `${this.$t('Global.errorMessage')}`,
              showConfirmButton: false,
              timer: 2000,
            })
          })
      })
    },
    updateStudentsFees(data, is_pg = false) {
      if (data) {
        this.form.faculty_id = data.faculty?.id
        this.form.program_id = data.program?.id
        this.settingForm.minimum_grade = data.data?.minimum_grade
        this.settingForm.prev_minimum_grade = data.data?.prev_minimum_grade
        this.settingForm.stem_minimum_grade = data.data?.stem_minimum_grade
        this.settingForm.quota = data.data?.quota
        this.settings_id = data.id
        this.settingForm.pre_university_certificate_type = data?.data?.certificate_type
        this.settingForm.pre_university_certificate_groupe = data?.data?.pre_university_certificate_groupe
        this.settingForm.pre_university_certificate = data?.data?.pre_university_certificate
        this.settingForm.arabic = data?.data?.arabic
        this.settingForm.english = data?.data?.english
        this.settingForm.french = data?.data?.french
        this.settingForm.german = data?.data?.german
        this.settingForm.math = data?.data?.math
        this.settingForm.advanced_math = data?.data?.advanced_math
        this.settingForm.biology = data?.data?.biology
        this.settingForm.chemistry = data?.data?.chemistry
        this.settingForm.physics = data?.data?.physics
        this.settingForm.italy = data?.data?.italy
      } else {
        this.form.faculty_id = null
        this.form.program_id = null
        this.settingForm.quota = null
        this.settings_id = null
        this.settingForm.minimum_grade = null
        this.settingForm.prev_minimum_grade = null
      }
      this.is_pg = is_pg
      this.openStudentDialog()
    },
    openStudentDialog() {
      this.students_dialog = true
    },
    updateStudentsPG(data, is_pg = false) {
      if (data) {
        this.form.faculty_id = data.faculty?.id
        this.form.program_id = data.program?.id
        this.settingForm.quota = data.data?.quota
        this.settings_id = data.id
      } else {
        this.form.faculty_id = null
        this.form.program_id = null
        this.settingForm.quota = null
        this.settings_id = null
      }
      this.openStudentPGDialog()
    },
    openStudentPGDialog() {
      this.students_pg_dialog = true
    },
    openDialog() {
      this.dialog = true
    },
    openEnrollDialog() {
      this.enroll_dialog = true
    },

    updateTerm(data) {
      this.term_form = {}
      if (data) {
        this.term_form.start_date = data.start_date
        this.term_form.end_date = data.end_date
        this.term_id = data.id
      }
      this.openTermDialog()
    },

    openTermDialog() {
      this.term_dialog = true
    },

    saveTerm() {
      this.$refs.term_form.validate().then(success => {
        if (success) {
          const payload = { id: this.term_id, query: this.term_form }
          this.$store.dispatch('terms/put', payload)
            .then(response => {
              this.$swal({
                icon: 'success',
                title: `${this.$t('Global.saved')}`,
                showConfirmButton: false,
                timer: 1500,
              })
              this.term_dialog = false
              this.init()
            }).catch(error => {
              const errors = [error.response.data.errors]
              errors.forEach((error, index) => {
                const error_data = Object.values(error)[index][0]
                this.errorsdata = error
              })
            })
        }
      })
    },

    checkFaculty(faculty_id, program_id) {
      if (program_id) {
        return true
      }
      if (faculty_id) {
        const selectedFaculties = this.item.payment_settings.find(el => el.faculty.id == faculty_id)
        if (selectedFaculties && selectedFaculties.program == null) {
          return false
        }
        return true
      }
    },
    submit() {
      this.$nextTick(_ => {
        this.$refs.simpleRules1
          .validate()
          .then(success => {
            if (success) {
              // && this.checkFaculty(this.form.faculty_id, this.form.program_id)
              const payload = {
                faculty_id: this.form.faculty_id,
                program_id: this.form.program_id,
                year_id: this.$route.params.id,
                name: 'ADMISSION_PAYMENTS_SETTINGS',
                value: { ...this.ruleForm, ...{ total: this.totalFees, total_usd: this.totalUsdFees } },
              }
              // delete payload['total'];
              // let query = {...payload,...{total:this.totalFees,total_usd:this.totalUsdFees}}
              this.editTuitionFees({
                id: this.settings_id || null,
                query: payload,
              })
                .then(_ => {
                  (this.dialog = false), (this.applicant_dialog = false)
                  this.students_dialog = false
                  this.grade_id = null
                  this.init()
                  this.$swal({
                    icon: 'success',
                    title: `${this.$t('Global.saved')}`,
                    showConfirmButton: false,
                    timer: 2000,
                  })
                })
                .catch(error => {
                  this.grade_id = null
                  this.$swal({
                    icon: 'error',
                    text: `${this.$t('Global.item_exist')}`,
                    showConfirmButton: false,
                    timer: 2000,
                  })
                })
            }
          })
          .catch(error => {
            this.$swal({
              icon: 'error',
              text: `${this.$t('Global.facultyExist')}`,
              showConfirmButton: false,
              timer: 2000,
            })
          })
      })
    },

    updateEnrollmentSettings(data, name) {
      if (data) {
        this.ruleForm.faculty_id = data.faculty ? data.faculty.id : null
        this.ruleForm.bylaw_id = data.bylaw ? data.bylaw.id : null
        this.ruleForm.term_id = this.id
        this.ruleForm.registration_date_from = data.value.registration_date_from
        this.ruleForm.registration_date_to = data.value.registration_date_to
        this.ruleForm.withdraw_date_from = data.value.withdraw_date_from
        this.ruleForm.withdraw_date_to = data.value.withdraw_date_to
        this.ruleForm.adddrop_date_from = data.value.adddrop_date_from
        this.ruleForm.adddrop_date_to = data.value.adddrop_date_to
        this.ruleForm.drop_date_from = data.value.drop_date_from
        this.ruleForm.drop_date_to = data.value.drop_date_to
        this.ruleForm.name = data.name
        this.settings_id = data.id
      } else {
        this.ruleForm.faculty_id = null
        this.ruleForm.bylaw_id = null
        this.ruleForm.term_id = this.id
        this.ruleForm.registration_date_from = null
        this.ruleForm.registration_date_to = null
        this.ruleForm.withdraw_date_from = null
        this.ruleForm.withdraw_date_to = null
        this.ruleForm.adddrop_date_from = null
        this.ruleForm.adddrop_date_to = null
        this.ruleForm.drop_date_from = null
        this.ruleForm.drop_date_to = null
        this.ruleForm.name = name
      }
      this.openEnrollDialog()
    },
    submitEnrollment() {
      this.$nextTick(_ => {
        this.$refs.ruleForm.validate()
          .then(success => {
            if (success) {
              const payload = {
                faculty_id: this.ruleForm.faculty_id,
                bylaw_id: this.ruleForm.bylaw_id,
                year_id: this.$route.params.id,
                name: this.ruleForm.name,
                value: { ...this.ruleForm },
              }

              this.addSetting({
                id: this.settings_id || null,
                query: payload,
              }).then(_ => {
                this.enroll_dialog = false
                this.init()
                this.$swal({
                  icon: 'success',
                  title: `${this.$t('Global.saved')}`,
                  showConfirmButton: false,
                  timer: 2000,
                })
              })
                .catch(error => {
                  this.$swal({
                    icon: 'error',
                    text: `${this.$t('Global.errorMessage')}`,
                    showConfirmButton: false,
                    timer: 2000,
                  })
                })
            }
          }).catch(error => {
            this.$swal({
              icon: 'error',
              text: `${this.$t('Global.errorMessage')}`,
              showConfirmButton: false,
              timer: 2000,
            })
          })
      })
    },
    remove(id) {
      this.$swal({
        title: `${this.$t('Global.deleteTitle')}`,
        text: `${this.$t('Global.deleteText')}`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        confirmButtonText: `${this.$t('Global.deleteBtn')}`,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.removeSetting(id).then(_ => {
            this.$swal({
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              title: this.$t('Global.deleted'),
            })
            this.init()
          })
        }
      })
    },

    init() {
      this.getLookups({
        faculty_id: this.ruleForm.faculty_id,
        faculties: true,
        bylaws: true,
        pre_certificates: true,
      }).then(_ => {
        if (this.id) {
          this.$store.dispatch('years/get', this.id).then(_ => {
            if (this.ruleForm.pre_university_certificate_type) {
              this.ruleForm.pre_university_certificate_type.forEach((el, i) => {
                this.item.data.pre_university_certificate_types.forEach(type => {
                  if (el.id == type.certificate_type) {
                    this.grades[i] = {
                      certificate_type: type.certificate_type,
                      minimum_grade: type.minimum_grade,
                      name: el.name,
                      name_local: el.name_local,
                    }
                    this.types[i] = {
                      certificate_type: type.certificate_type,
                      minimum_grade: type.minimum_grade,
                    }
                  }
                })
              })
            }
          })
        }
      })
    },
  },
}
</script>

<style scoped></style>
