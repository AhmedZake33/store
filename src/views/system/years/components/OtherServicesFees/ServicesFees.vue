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
              {{ $t('other_services_fees') }}
            </h3>
            <b-button
                v-b-tooltip.hover="$t('Global.add')"
                class="btn-icon float-right"
                variant="primary"
                @click="addNewFeesModal"
            >
              <feather-icon icon="PlusIcon" />
            </b-button>
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
              :fields="feesFields"
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
                    v-if="hasPermission('show_other_services_fees')"
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
                    v-if="hasPermission('edit_other_services_fees')"
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
        <b-row>
          <div class="m-1 d-block w-100">
            <h3 class="d-inline">
              {{ $t('Excuse Fees Equation') }}
            </h3>
          </div>
          <b-overlay
            class="mx-2 d-block w-100"
            :show="load"
            rounded="sm"
          >
            <ul>
              <li>Excuse First Term: Pay 25% of First Installment + Full Second Installment عذر عن فصل دراسي</li>
              <li>Excuse Second Term: Pay First Installment + 25% of Second Installment عذر عن  فصل دراسي</li>
              <li>Excuse Full Year (first time): Pay Administrative Fees + 10% of all other Fees</li>
              <li>Excuse Full Year (second time): Pay Administrative Fees + 25% of all other Fees</li>
            </ul>
          </b-overlay>
        </b-row>
      </div>
    </b-overlay>

    <div class="all-modals">
      <b-modal
        ref="fees-modal"
        size="lg"
        :title="modal_change_title"
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
          :loading="modal_loading"
          @hideModal="hideModal"
          @refresh="refresh"
          @hide="cancelEdit()"
        />
        <show-fees
          v-else
          :data="feesData"
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

import ShowFees from "@/views/system/years/components/ServicesFees/ShowServiceFees";
import EditFees from "@/views/system/years/components/ServicesFees/EditServiceFees";

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
    feesFields() {
      return [
        {
          key: 'name',
          label: this.$t('english_name'),
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

      feesData: {},
      editFees: false,

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
        type: 'other-services-fees',
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

      this.modal_change_title = this.$t('service_fees_title',
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
        this.feesData = response.data
      }).finally(() => {
        this.editFees = showEdit
        this.modal_loading = false
      })

      // show modal
      this.$refs['fees-modal'].show()
    },

    refresh() {
      this.init()
    },
    hideModal() {
      this.$refs['fees-modal'].hide()
    },
    openEdit() {
      this.editFees = true
    },
    cancelEdit() {
      this.editFees = false
    },
    cancel() {
      this.edit = false
    },
    addNewFeesModal() {
      this.feesData = null
      this.paymentSettingId = 'create-other-service-fees'

      this.modal_change_title = this.$t('Add New Other Service Fees')
      this.editFees = true
      this.modal_loading = false

      // show modal
      this.$refs['fees-modal'].show()
    },
  },
}
</script>

<style>

</style>
