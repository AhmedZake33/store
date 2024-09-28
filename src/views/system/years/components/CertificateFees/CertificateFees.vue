<template>
  <b-card no-body>
    <b-overlay
      :show="load"
      rounded="sm"
    >
      <div>
        <b-row>
          <div class="m-1 d-block w-100">
            <h3 class="d-inline">
              {{ $t('Certificate Fees Setting') }}
            </h3>
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
              :fields="certificateFeesFields"
              responsive="sm"
              striped
              style="text-align: center;"
            >
              <template #cell(name)="data">
                <span v-if="data.item.service.name">
                  {{ data.item.service.name }}
                </span>
              </template>
              <template #cell(name_local)="data">
                <span v-if="data.item.service.name_local">
                  {{ data.item.service.name_local }}
                </span>
              </template>
              <template #cell(value_local)="data">
                <span>
                  {{ data.item.value_local }}
                </span>
              </template>
              <template #cell(value_usd)="data">
                <span>
                  {{ data.item.value_usd }}
                </span>
              </template>
              <template #cell(actions)="data">
                <div>
                  <feather-icon
                    v-if="hasPermission('show_certificate_fees')"
                    v-b-tooltip.hover="$t('Global.show')"
                    icon="EyeIcon"
                    style="cursor: pointer; margin-right: 3px;"
                    @click="showModal(
                      {
                        paymentSettingId: data.item.id,
                        name: data.item.service
                      }
                      ,false)"
                  />
                  <feather-icon
                    v-if="hasPermission('edit_certificate_fees')"
                    v-b-tooltip.hover="$t('Global.edit')"
                    icon="EditIcon"
                    style="cursor: pointer"
                    @click="showModal(
                      {
                        paymentSettingId: data.item.id,
                        name: data.item.service
                      }
                      ,true)"
                  />
                </div>
              </template>
            </b-table>
          </b-overlay>
        </b-row>
      </div>
      <div>
        <b-row class="pt-3">
          <!-- <div class="m-1 d-block w-100">
            <h3 class="d-inline">
              {{ $t('Certificate Dates Setting') }}
            </h3>
          </div> -->
          <b-overlay
            class="mx-2 d-block w-100"
            :show="load"
            rounded="sm"
          >
            <CertificateDates :yearId="yearId" />
          </b-overlay>
        </b-row>
      </div>
    </b-overlay>

    <div class="all-modals">
      <b-modal
        ref="certificate-modal"
        size="lg"
        :title="modal_change_title"
        no-close-on-backdrop
        hide-footer
        @show="resetModal"
        @hidden="resetModal"
      >
        <edit-certificate-fees
          v-if="editCertificateFees"
          :data="certificateFeesData"
          :year-id="yearId"
          :payment-setting-id="paymentSettingId"
          :lookup-payment-accounts="payment_accounts"
          :inline="true"
          :loading="modal_loading"
          @hideModal="hideModal"
          @refresh="refresh"
          @hide="cancelEdit()"
        />
        <show-certificate-fees
          v-else
          :data="certificateFeesData"
          :loading="modal_loading"
          @hideModal="hideModal"
          @refresh="refresh"
        >
          <template #edit>
            <div class="mb-2">
              <feather-icon
                v-b-tooltip.hover="$t('Global.edit')"
                style="cursor: pointer"
                icon="EditIcon"
                class="font-medium-3"
                @click="openEdit()"
              />
            </div>
          </template>
        </show-certificate-fees>
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

import ShowCertificateFees from "@/views/system/years/components/CertificateFees/ShowCertificateFees";
import EditCertificateFees from "@/views/system/years/components/CertificateFees/EditCertificatFees";
import CertificateDates from "@/views/system/years/components/CertificateDates/CertificateDates.vue";

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
    CertificateDates,
    ShowCertificateFees,
    EditCertificateFees,

    TabTable,
    BOverlay,
    BTable,
    BTr,
    BTh,
  },
  computed: {
    ...mapGetters({
    }),
    certificateFeesFields() {
      return [
        {
          key: 'name',
          label: this.$t('name'),
        },
        {
          key: 'name_local',
          label: this.$t('name_local'),
        },
        {
          key: 'value_local',
          label: this.$t('value_local'),
        },
        {
          key: 'value_usd',
          label: this.$t('value_usd'),
        },
        {
          key: 'actions',
          label: this.$t('actions'),
        },
      ]
    },
    id() {
      return this.$route.params.id ? this.$route.params.id : null
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
    type: {
      default: null,
      type: String,
    },
  },
  data() {
    return {
      load: false,
      data: {},
      dataDetails: {},

      certificateFeesData: {},
      editCertificateFees: false,

      payment_accounts: [],

      lookups: null,
      modal_loading: true,
      modal_change_title: 'Fees',
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
        type: 'certificate-fees',
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

    showModal(item, showEdit = false) {
      this.modal_loading = true

      this.paymentSettingId = item.paymentSettingId

      this.modal_change_title = this.$t('certificate_fees_title',
        {
          name: this.getTranslatedNameFromObject(item.name),
        })

      // get settings
      const payload = {
        yearId: this.yearId,
        paymentSettingId: this.paymentSettingId,
        data: {
          service_details: true,
        },
      }

      this.getPaymentSetting(payload).then(response => {
        this.certificateFeesData = response.data
      }).finally(() => {
        this.editCertificateFees = showEdit
        this.modal_loading = false
        // show modal
        this.$refs['certificate-modal'].show()
      })

    },

    refresh() {
      this.init()
    },
    hideModal() {
      this.$refs['certificate-modal'].hide()
    },
    openEdit() {
      this.editCertificateFees = true
    },
    cancelEdit() {
      this.editCertificateFees = false
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

</style>
