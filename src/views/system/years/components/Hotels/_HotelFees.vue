<template>
  <b-card no-body>
    <b-overlay
      :show="load"
      rounded="sm"
    >
      <div>
        <!-- <b-row class="mb-1 w-100 align-items-center">
          <div class="mx-2 d-block w-100">
            <h3 class="">
              {{ $t('Global.insurance_fees') }}
            </h3>
          </div>
          <div class="mx-2 d-block w-100 text-center">
            <strong class="w-100 d-flex justify-content-center align-items-center flex-wrap">
              <div v-if="item && item.insurance_fees">
                {{ $t('Global.a_amount') }} :
                <small class="text-uppercase text-primary text-bold">
                  {{ numberWithCommas(item.insurance_fees.value_local) }}
                </small>
                {{ $t('Global.usd_amount') }} :
                <small class="text-uppercase text-primary text-bold">
                  {{ numberWithCommas(item.insurance_fees.value_usd) }}
                </small>
                <strong>{{ $t('Global.ttb') }}</strong>:
                <small v-if="data.insurance_fees.options_value"> {{ getSwitchAfterLabel(data.insurance_fees.options_value.after) }} </small>
              </div>
              <feather-icon
                v-if="hasPermission('edit_admission_fees')"
                icon="EditIcon"
                class="mx-2"
                style="cursor: pointer"
                @click="showFileFeesModal(item.insurance_fees,true)"
              />
            </strong>
          </div>
        </b-row> -->
        <hr>
        <b-row>
          <div class="m-1 d-block w-100">
            <h3 class="d-inline">
              {{ $t('Hotel Fees') }}
            </h3>
<!--            <b-button
              v-b-tooltip.hover="$t('Global.add')"
              class="btn-icon float-right"
              variant="primary"
              @click="addExamsFeesModal"
            >
              <feather-icon icon="PlusIcon" />
            </b-button>-->
          </div>
          <b-overlay
            class="mx-2 d-block w-100"
            :show="load"
            rounded="sm"
          >
            <b-table
              outlined
              :empty-text="$t('Global.empty_text')"
              show-empty
              :items="item"
              :fields="examFeesFields"
              responsive="sm"
              striped
              style="text-align: center;"
            >
              <template #thead-top>
                <b-tr>
                  <b-th colspan="2" />
                  <b-th
                    colspan="2"
                    class="border-left-right"
                  >
                    {{ $t('egy_pound') }}
                  </b-th>
                  <b-th
                    colspan="2"
                    class="border-left-right"
                  >
                    {{ $t('usd_dollar') }}
                  </b-th>
                  <b-th />
                </b-tr>
              </template>
              <template #cell(occupancy)="data">
                <span v-if="data.item.service.service_hotel">
                  {{ data.item.service.service_hotel.occupancy == 0 ? $t('Single') : $t('Double') }}
                </span>
              </template>
              <template #cell(name)="data">
                <span v-if="data.item.service.service_hotel">
                  {{ getTranslatedNameFromObject(data.item.service.service_hotel) }}
                </span>
                <span v-else>
                  {{ data.item.service.name }}
                </span>
              </template>
              <template #cell(insurance_local)="data">
                <span>
                  {{ data.item.payment_setting_installments[0].value_local }}
                </span>
              </template>
              <template #cell(insurance_usd)="data">
                <span>
                  {{ data.item.payment_setting_installments[0].value_usd }}
                </span>
              </template>
              <template #cell(fees_local)="data">
                <span>
                  {{ data.item.payment_setting_installments[1].value_local }}
                </span>
              </template>
              <template #cell(fees_usd)="data">
                <span>
                  {{ data.item.payment_setting_installments[1].value_usd }}
                </span>
              </template>
              <template #cell(actions)="data">
                <div>
                  <feather-icon
                    v-if="hasPermission('show_hotel_fees')"
                    v-b-tooltip.hover="$t('Global.show')"
                    icon="EyeIcon"
                    style="cursor: pointer; margin-right: 3px;"
                    @click="showFeesModal(
                      {
                        paymentSettingId: data.item.id,
                        name: data.item.service
                      }
                      ,false)"
                  />
                  <feather-icon
                    v-if="hasPermission('edit_hotel_fees')"
                    v-b-tooltip.hover="$t('Global.edit')"
                    icon="EditIcon"
                    style="cursor: pointer"
                    @click="showFeesModal(
                      {
                        paymentSettingId: data.item.id,
                        name: data.item.service
                      }
                      ,true)"
                  />
<!--                  <feather-icon
                    v-b-tooltip.hover="$t('Global.delete')"
                    icon="Trash2Icon"
                    style="cursor: pointer"
                    class="text-danger"
                    @click="removePaymentSettingBtn(data.item.id)"
                  />-->
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
          :data="insuranceFeesData"
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
          :data="insuranceFeesData"
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
        ref="fees-modal"
        size="lg"
        :title="modal_change_fees_title"
        no-close-on-backdrop
        hide-footer
        @show="resetModal"
        @hidden="resetModal"
      >
        <edit-fees
          v-if="editFees"
          :data="feesData"
          :year-id="yearId"
          :payment-setting-id="paymentSettingId"
          :lookup-payment-accounts="payment_accounts"
          :inline="true"
          :loading="modal_fees_loading"
          @hideModal="hideModal()"
          @refresh="refresh"
          @hide="cancelEdit('hotel-fees')"
        />
        <show-fees
          v-else
          :data="feesData"
          :loading="modal_fees_loading"
          @hideModal="hideModal()"
          @refresh="refresh"
        >
          <template #edit>
            <div class="mb-2">
              <feather-icon
                v-b-tooltip.hover="$t('Global.edit')"
                style="cursor: pointer"
                icon="EditIcon"
                class="font-medium-3"
                @click="openEdit('hotel-fees')"
              />
            </div>
          </template>
        </show-fees>
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
import EditFileFees from '@/views/system/years/components/Hotels/FileFees/EditFileFees'
import ShowFees from '@/views/system/years/components/Hotels/ShowHotelFees'
import EditFees from '@/views/system/years/components/Hotels/EditHotelFees'
import ShowFileFees from '@/views/system/years/components/Hotels/FileFees/ShowFileFees'

export default {
  components: {
    TabTable,
    Edit,
    Statistics,
    vSelect,
    BFormCheckbox,
    ShowFileFees,
    Students,
    Offerings,
    ShowComponent,
    BFormInput,
    EditFileFees,
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

    ShowFees,
    EditFees,

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
          key: 'occupancy',
          label: this.$t('occupancy'),
        },
        {
          key: 'name',
          label: this.$t('name'),
        },
        {
          key: 'fees_local',
          label: this.$t('fees'),
        },
        {
          key: 'insurance_local',
          label: this.$t('insurance_fees'),
        },
        {
          key: 'fees_usd',
          label: this.$t('fees'),
          thClass: 'my-left-border',
        },
        {
          key: 'insurance_usd',
          label: this.$t('insurance_fees'),
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
    item() {
      return this.data.hotel_fees
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
  },
  data() {
    return {
      load: false,
      data: {},
      dataDetails: {},
      insuranceFeesData: {},

      feesData: {},
      editFees: false,

      payment_accounts: [],

      lookups: null,
      modal_fees_loading: true,
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
        type: 'hotel-fees',
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
        this.insuranceFeesData = res.data.payment_setting
      }).then(() => {
        this.showEdit = showEdit
        this.$refs['file-modal'].show()
      })
    },
    hideFileModal() {
      this.$refs['file-modal'].hide()
      this.editFileFees = false
    },
    showFeesModal(item, showEdit = false) {
      this.modal_fees_loading = true

      this.paymentSettingId = item.paymentSettingId

      this.modal_change_fees_title = this.$t('hotel_fees_title',
        {
          name: this.getTranslatedNameFromObject(item.name),
        })

      // get level settings
      const payload = {
        yearId: this.yearId,
        paymentSettingId: this.paymentSettingId,
        data: {
          service_details: true,
        },
      }

      this.getPaymentSetting(payload).then(response => {
        this.feesData = response.data
      }).finally(() => {
        this.editFees = showEdit
        this.modal_fees_loading = false
      })

      // show modal
      this.$refs['fees-modal'].show()
    },

    refresh() {
      this.init()
    },

    hideModal() {
      this.$refs['fees-modal'].hide()
      this.editFees = false
    },

    openEdit(type) {
      switch (type) {
        case 'file-fees':
          this.editFileFees = true
          break
        case 'hotel-fees':
          this.editFees = true
          break
      }
    },

    cancelEdit(type) {
      this.editFees = false
    },
    cancel() {
      this.edit = false
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
</style>
