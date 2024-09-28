<template>
  <b-card no-body>
    <b-overlay
      :show="load"
      rounded="sm"
    >
      <div>
        <b-row class="mb-1 w-100 align-items-center">
          <div class="mx-2 d-block w-100">
            <h3 class="">
              {{ $t('Global.applicant_file') }}
            </h3>
          </div>
          <div class="mx-2 d-block w-100 text-center">
            <strong class="w-100 d-flex justify-content-center align-items-center flex-wrap">
              <div v-if="item && item.file_fees">
                {{ $t('Global.a_amount') }} :
                <small class="text-uppercase text-primary text-bold">
                  {{ numberWithCommas(item.file_fees.value_local) }}
                </small>
                {{ $t('Global.usd_amount') }} :
                <small class="text-uppercase text-primary text-bold">
                  {{ numberWithCommas(item.file_fees.value_usd) }}
                </small>
                <strong>{{ $t('Global.ttb') }}</strong>:
                <small> {{ getSwitchAfterLabel(data.file_fees.options_value.after) }} </small>
              </div>
              <feather-icon
                v-if="hasPermission('edit_admission_fees')"
                icon="EditIcon"
                class="mx-2"
                style="cursor: pointer"
                @click="showFileFeesModal(item.file_fees,true)"
              />
            </strong>
          </div>
        </b-row>
        <hr>
        <b-row>
          <div class="m-1 d-block w-100">
            <h3 class="d-inline">
              {{ $t('Admission Exams Fees') }}
            </h3>
            <b-button
              v-if="hasPermission('edit_admission_fees')"
              v-b-tooltip.hover="$t('Global.add')"
              class="btn-icon float-right"
              variant="primary"
              @click="addExamsFeesModal"
            >
              <feather-icon icon="PlusIcon" />
            </b-button>
          </div>
          <b-overlay
            class="mx-1 d-block w-100"
            :show="load"
            rounded="sm"
          >
            <b-table
              outlined
              :empty-text="$t('Global.empty_text')"
              show-empty
              :items="item.exam_fees"
              :fields="examFeesFields"
              striped
              style="text-align: center;"
            >
              <template #thead-top>
                <b-tr>
                  <b-th colspan="2" />
                  <b-th
                    colspan="1"
                    class="border-left-right"
                  >
                    {{ $t('egy_pound') }}
                  </b-th>
                  <b-th
                    colspan="1"
                    class="border-left-right"
                  >
                    {{ $t('usd_dollar') }}
                  </b-th>
                  <b-th />
                </b-tr>
              </template>
              <template #cell(faculty)="data">
                <span v-if="data.item.faculty">
                  {{ getTranslatedNameFromObject( data.item.faculty ) }}
                </span>
              </template>
              <template #cell(program)="data">
                <span v-if="data.item.program">
                  {{ getTranslatedNameFromObject( data.item.program ) }}
                </span>
              </template>
              <template #cell(exam_local)="data">
                <span>
                  {{ data.item.payment_setting_installments[0].value_local }}
                </span>
              </template>
              <template #cell(exam_usd)="data">
                <span>
                  {{ data.item.payment_setting_installments[0].value_usd }}
                </span>
              </template>
              <template #cell(actions)="data">
                <div>
                  <feather-icon
                    v-if="hasPermission('show_admission_fees')"
                    v-b-tooltip.hover="$t('Global.show')"
                    icon="EyeIcon"
                    style="cursor: pointer;"
                    @click="showExamsFeesModal(
                      {
                        paymentSettingId: data.item.id,
                        faculty: data.item.faculty,
                        program: data.item.program
                      }
                      ,false)"
                  />
                  <feather-icon
                    v-if="hasPermission('edit_admission_fees')"
                    v-b-tooltip.hover="$t('Global.edit')"
                    icon="EditIcon"
                    style="cursor: pointer; margin-left: 3px; margin-right: 3px;"
                    @click="showExamsFeesModal(
                      {
                        paymentSettingId: data.item.id,
                        faculty: data.item.faculty,
                        program: data.item.program
                      }
                      ,true)"
                  />
                  <feather-icon
                    v-if="hasPermission('delete_admission_fees')"
                    v-b-tooltip.hover="$t('Global.delete')"
                    icon="Trash2Icon"
                    style="cursor: pointer"
                    class="text-danger"
                    @click="removePaymentSettingBtn(data.item.id)"
                  />
                </div>
              </template>
            </b-table>
          </b-overlay>
        </b-row>
        <hr>
        <b-row>
          <div class="m-1 d-block w-100">
            <h3 class="d-inline">
              {{ $t('Admission Training Fees') }}
            </h3>
            <b-button
              v-if="hasPermission('edit_admission_fees')"
              v-b-tooltip.hover="$t('Global.add')"
              class="btn-icon float-right"
              variant="primary"
              @click="addTrainingFeesModal"
            >
              <feather-icon icon="PlusIcon" />
            </b-button>
          </div>
          <b-overlay
            class="mx-1 d-block w-100"
            :show="load"
            rounded="sm"
          >
            <b-table
              outlined
              :empty-text="$t('Global.empty_text')"
              show-empty
              :items="item.training_fees"
              :fields="trainingFeesFields"
              striped
              style="text-align: center;"
            >
              <template #thead-top>
                <b-tr>
                  <b-th colspan="2" />
                  <b-th
                    colspan="1"
                    class="border-left-right"
                  >
                    {{ $t('egy_pound') }}
                  </b-th>
                  <b-th
                    colspan="1"
                    class="border-left-right"
                  >
                    {{ $t('usd_dollar') }}
                  </b-th>
                  <b-th />
                </b-tr>
              </template>
              <template #cell(faculty)="data">
                <span v-if="data.item.faculty">
                  {{ getTranslatedNameFromObject( data.item.faculty ) }}
                </span>
              </template>
              <template #cell(program)="data">
                <span v-if="data.item.program">
                  {{ getTranslatedNameFromObject( data.item.program ) }}
                </span>
              </template>
              <template #cell(exam_local)="data">
                <span>
                  {{ data.item.payment_setting_installments[0].value_local }}
                </span>
              </template>
              <template #cell(exam_usd)="data">
                <span>
                  {{ data.item.payment_setting_installments[0].value_usd }}
                </span>
              </template>
              <template #cell(actions)="data">
                <div>
                  <feather-icon
                    v-if="hasPermission('show_admission_fees')"
                    v-b-tooltip.hover="$t('Global.show')"
                    icon="EyeIcon"
                    style="cursor: pointer;"
                    @click="showExamsFeesModal(
                      {
                        paymentSettingId: data.item.id,
                        faculty: data.item.faculty,
                        program: data.item.program
                      }
                      ,false)"
                  />
                  <feather-icon
                    v-if="hasPermission('edit_admission_fees')"
                    v-b-tooltip.hover="$t('Global.edit')"
                    icon="EditIcon"
                    style="cursor: pointer; margin-left: 3px; margin-right: 3px;"
                    @click="showExamsFeesModal(
                      {
                        paymentSettingId: data.item.id,
                        faculty: data.item.faculty,
                        program: data.item.program
                      }
                      ,true)"
                  />
                  <feather-icon
                    v-if="hasPermission('delete_admission_fees')"
                    v-b-tooltip.hover="$t('Global.delete')"
                    icon="Trash2Icon"
                    style="cursor: pointer"
                    class="text-danger"
                    @click="removePaymentSettingBtn(data.item.id)"
                  />
                </div>
              </template>
            </b-table>
          </b-overlay>
        </b-row>
      </div>
    </b-overlay>

    <div class="all-modals">
      <!-- modal -->
      <b-modal
        id="file-modal"
        ref="file-modal"
        :title="$t('Admission File Fees')"
        size="lg"
        no-close-on-backdrop
        hide-footer
        @show="resetModal"
        @hidden="resetModal"
      >
        <edit-file-fees
          v-if="editFileFees"
          :data="fileFeesData"
          :year-id="yearId"
          :payment-setting-id="paymentSettingId"
          :lookup-payment-accounts="payment_accounts"
          :inline="true"
          @hideModal="hideFileModal"
          @refresh="refresh"
          @hide="cancelEdit('file-fees')"
        />
        <show-file-fees
          v-else
          :data="fileFeesData"
          @hideModal="hideFileModal"
          @refresh="refresh"
        >
          <template #edit>
            <div class="mb-2">
              <feather-icon
                v-b-tooltip.hover="$t('Global.edit')"
                style="cursor: pointer"
                icon="EditIcon"
                class="font-medium-3"
                @click="openEdit('file-fees')"
              />
            </div>
          </template>
        </show-file-fees>
      </b-modal>

      <b-modal
        ref="exams-modal"
        size="lg"
        :title="modal_change_fees_title"
        no-close-on-backdrop
        hide-footer
        @show="resetModal"
        @hidden="resetModal"
      >
        <edit-exams-fees
          v-if="editExamsFees"
          :data="examsFeesData"
          :year-id="yearId"
          :payment-setting-id="paymentSettingId"
          :lookup-payment-accounts="payment_accounts"
          :inline="true"
          :title="ifAdd"
          :loading="exams_fees_loading"
          @hideModal="hideExamsModal"
          @refresh="refresh"
          @hide="cancelEdit('exams-fees')"
        />
        <show-exams-fees
          v-else
          :data="examsFeesData"
          :loading="exams_fees_loading"
          @hideModal="hideExamsModal"
          @refresh="refresh"
        >
          <template #edit>
            <div class="mb-2">
              <feather-icon
                v-if="hasPermission('edit_admission_fees')"
                v-b-tooltip.hover="$t('Global.edit')"
                style="cursor: pointer"
                icon="EditIcon"
                class="font-medium-3"
                @click="openEdit('exams-fees')"
              />
            </div>
          </template>
        </show-exams-fees>
      </b-modal>

      <!-- Training fees Modal -->
      <b-modal
        ref="training-modal"
        size="lg"
        :title="modal_change_fees_title"
        no-close-on-backdrop
        hide-footer
        @show="resetModal"
        @hidden="resetModal"
      >
        <edit-training-fees
          v-if="editTrainingFees"
          :data="trainingFeesData"
          :year-id="yearId"
          :payment-setting-id="paymentSettingId"
          :lookup-payment-accounts="payment_accounts"
          :inline="true"
          :title="ifAdd"
          :loading="training_fees_loading"
          @hideModal="hideTrainingModal"
          @refresh="refresh"
          @hide="cancelEdit('training-fees')"
        />
        <show-training-fees
          v-else
          :data="trainingFeesData"
          :loading="training_fees_loading"
          @hideModal="hideTrainingModal"
          @refresh="refresh"
        >
          <template #edit>
            <div class="mb-2">
              <feather-icon
                v-if="hasPermission('edit_admission_fees')"
                v-b-tooltip.hover="$t('Global.edit')"
                style="cursor: pointer"
                icon="EditIcon"
                class="font-medium-3"
                @click="openEdit('training-fees')"
              />
            </div>
          </template>
        </show-training-fees>
      </b-modal>
    </div>
  </b-card>
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
  BTabs,
  BButton,
  BCardBody,
  BCardHeader,
  BOverlay,
  BTable,
  BTr,
  BTh,
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import { required } from '@validations'
import vSelect from 'vue-select'
import ShowComponent from '@/views/components/info/show'
import Offerings from '@/views/study/offerings/components/offerings'
import Students from '@/views/students/student/components/students'
import Edit from '@/views/admission/terms/edit'
import Statistics from '@/views/components/info/statistics'
import TabTable from '@/views/students/student/components/TabTable'

import ShowFileFees from '@/views/system/years/components/AdmissionFees/FileFees/ShowFileFees'
import EditFileFees from '@/views/system/years/components/AdmissionFees/FileFees/EditFileFees'

import ShowExamsFees from '@/views/system/years/components/AdmissionFees/ExamsFees/ShowExamFees'
import EditExamsFees from '@/views/system/years/components/AdmissionFees/ExamsFees/EditExamFees'

import ShowTrainingFees from '@/views/system/years/components/AdmissionFees/TrainingFees/ShowTrainingFees'
import EditTrainingFees from '@/views/system/years/components/AdmissionFees/TrainingFees/EditTrainingFees'

export default {
  components: {
    TabTable,
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

    ShowFileFees,
    EditFileFees,
    ShowExamsFees,
    EditExamsFees,
    ShowTrainingFees,
    EditTrainingFees,

    TabTable,
    BOverlay,
    BTable,
    BTr,
    BTh,
  },
  computed: {
    ...mapGetters({
    }),
    examFeesFields() {
      return [
        {
          key: 'faculty',
          label: this.$t('faculty'),
        },
        {
          key: 'program',
          label: this.$t('program'),
        },
        {
          key: 'value_local',
          label: this.$t('exam_fees'),
          thClass: 'my-left-border',
        },
        {
          key: 'value_usd',
          label: this.$t('exam_fees'),
          // variant: 'secondary',
          thClass: 'my-left-border',
        },
        {
          key: 'actions',
          label: this.$t('actions'),
          thClass: 'my-left-border',
        },
      ]
    },
    trainingFeesFields() {
      return [
        {
          key: 'faculty',
          label: this.$t('faculty'),
        },
        {
          key: 'program',
          label: this.$t('program'),
        },
        {
          key: 'value_local',
          label: this.$t('training_fees'),
          thClass: 'my-left-border',
        },
        {
          key: 'value_usd',
          label: this.$t('training_fees'),
          thClass: 'my-left-border',
        },
        {
          key: 'actions',
          label: this.$t('actions'),
          thClass: 'my-left-border',
        },
      ]
    },
    id() {
      return this.$route.params.id ? this.$route.params.id : null
    },
    options() {
      return [
        {
          id: 1,
          label: this.$t('Global.applicant_after'),
        },
        {
          id: 0,
          label: this.$t('Global.applicant_before'),
        },
      ]
    },
    item() {
      return this.data
    },
  },
  props: {
    loading: {
      default: true,
      type: Boolean,
    },
    yearId: {
      default: null,
      type: String,
    },
    paymentSettingId: {
      default: null,
      type: String,
    },
    admissionType: {
      default: 'admission-fees-ug',
      type: String,
    },
  },
  data() {
    return {
      load: false,
      ifAdd: false,
      data: {},
      dataDetails: {},

      fileFeesData: {},
      editFileFees: false,

      examsFeesData: {},
      editExamsFees: false,

      trainingFeesData: {},
      editTrainingFees: false,

      payment_accounts: [],
      faculty_exam_fees: false,
      faculty_training_fees: false,
      faculty_fees: false,
      lookups: null,
      exams_fees_loading: true,
      training_fees_loading: true,
      modal_change_fees_title: 'Fees',
    }
  },
  watch: {
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions({
      getPayments: 'yearPayments/getPayments',
      getPaymentSetting: 'yearPayments/getPaymentSetting',
      removePaymentSetting: 'yearPayments/removePaymentSetting',
      getLookups: 'app/GET_LOOKUPS',
    }),
    init() {
      // get payments
      const payload = {
        type: this.admissionType,
        yearId: this.yearId,
      }
      this.load = true
      this.getPayments(payload).then(res => {
        this.data = res.data
        this.load = false
      })

      // get payment accounts lookup
      const lookupPayload = {
        payment_accounts: true,
      }
      this.getLookups(lookupPayload).then(data => {
        this.lookups = data.success
        this.payment_accounts = this.lookups.payment_accounts
      })
    },
    resetModal() {},

    showFileFeesModal(item, showEdit = false) {
      this.paymentSettingId = item.id
      const payload = {
        yearId: this.yearId,
        paymentSettingId: item.id,
      }
      this.getPaymentSetting(payload).then(res => {
        this.fileFeesData = res.data.payment_setting
      }).then(() => {
        this.showEdit = showEdit
        this.$refs['file-modal'].show()
      })
    },

    showExamsFeesModal(item, showEdit = false) {
      this.exams_fees_loading = true

      this.paymentSettingId = item.paymentSettingId

      this.modal_change_fees_title = this.$t('exam_fees_title',
        {
          faculty: this.getTranslatedNameFromObject(item.faculty),
          program: this.getTranslatedNameFromObject(item.program),
        })

      // get level settings
      const payload = {
        yearId: this.yearId,
        paymentSettingId: this.paymentSettingId,
      }

      this.getPaymentSetting(payload).then(response => {
        this.examsFeesData = response.data
      }).finally(() => {
        this.editExamsFees = showEdit
        this.exams_fees_loading = false
      })

      // show modal
      this.$refs['exams-modal'].show()
    },

    addExamsFeesModal() {
      this.examsFeesData = null
      if (this.admissionType === 'admission-fees-ug') {
        this.paymentSettingId = 'create-admission-exam-fees-ug'
      } else if (this.admissionType === 'admission-fees-pg') {
        this.paymentSettingId = 'create-admission-exam-fees-pg'
      }

      this.modal_change_fees_title = this.$t('Add New Exam Fees')
      this.editExamsFees = true
      this.exams_fees_loading = false
      this.ifAdd = true

      // show modal
      this.$refs['exams-modal'].show()
    },

    addTrainingFeesModal() {
      this.trainingFeesData = null
      if (this.admissionType === 'admission-fees-ug') {
        this.paymentSettingId = 'create-admission-training-fees-ug'
      } else if (this.admissionType === 'admission-fees-pg') {
        this.paymentSettingId = 'create-admission-training-fees-pg'
      }

      this.modal_change_fees_title = this.$t('Add New Training Fees')
      this.editTrainingFees = true
      this.training_fees_loading = false
      this.ifAdd = true

      // show modal
      this.$refs['training-modal'].show()
    },

    refresh() {
      this.init()
    },

    hideFileModal() {
      this.$refs['file-modal'].hide()
      this.editFileFees = false
    },
    hideExamsModal() {
      this.$refs['exams-modal'].hide()
      this.editExamsFees = false
    },

    hideTrainingModal() {
      this.$refs['training-modal'].hide()
      this.editTrainingFees = false
    },

    getSwitchAfterLabel(value) {
      switch (value) {
        case 1:
          return this.$t('Global.applicant_after')
        case 0:
          return this.$t('Global.applicant_before')
      }
      return 'none'
    },
    showModal(data, showEdit = false) {},
    hideModal() {
      this.$refs['exams-modal'].hide()
    },
    openEdit(type) {
      switch (type) {
        case 'file-fees':
          this.editFileFees = true
          break
        case 'exams-fees':
          this.editExamsFees = true
          break
        case 'training-fees':
          this.editTrainingFees = true
          break
      }
    },
    cancelEdit(type) {
      switch (type) {
        case 'file-fees':
          this.editFileFees = false
          break
        case 'exams-fees':
          this.editExamsFees = false
          break
        case 'training-fees':
          this.editTrainingFees = false
          break
      }
    },
    cancel() {
      this.edit = false
    },

    removePaymentSettingBtn(paymentSettingId) {
      const payload = {
        yearId: this.yearId,
        paymentSettingId,
      }

      this.$swal({
        title: this.$t("Global.deleteTitle"),
        text: this.$t("Global.deleteText"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("Global.cancel"),
        confirmButtonText: this.$t("Global.deleteBtn"),
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.load = true
          this.removePaymentSetting(payload).finally(_=>{
            this.refresh()
          })
        }
      })
    },
  },
}
</script>

<style>
.b-table .border-left-right{
  border-left: 2px solid #cbcbcbde;
  border-right: 2px solid #cbcbcbde;
}

.b-table .my-left-border {
  border-left: 2px solid #cbcbcbde;
}

.b-table .my-right-border {
  border-right: 2px solid #cbcbcbde;
}

.table th, .table td {
    padding-inline-start: 8px !important;
    vertical-align: middle;
}
</style>
