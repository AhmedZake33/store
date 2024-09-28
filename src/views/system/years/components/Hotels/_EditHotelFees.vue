<template>
  <div
      class="new_edit"
  >
    <validation-observer ref="simpleRules">
      <b-form
          ref="form"
          @submit.stop.prevent="save"
      >
        <b-col cols="12">
          <b-overlay
              :show="loading"
              rounded="sm"
          >
            <b-card v-if="formPaymentSetting">
              <b-card-header class="mt-0 pt-0 pb-0 p-0">
                <div class="mt-0 d-flex align-items-center">
                  <h3>
                    {{ $t('Hotel Fees Details') }}
                  </h3>
                </div>
                <div class="mb-2">
                  <feather-icon
                      v-b-tooltip.hover="$t('Global.close')"
                      style="cursor: pointer"
                      icon="XCircleIcon"
                      class="font-medium-3"
                      @click="cancel()"
                  />
                </div>
              </b-card-header>
              <div>
                <b-col md="12">
                  <list
                      style="padding: 0 !important"
                      :data="formPaymentSetting"
                      :only="[]"
                      :has-margins="false"
                      class="new_edit"
                  >
                    <template #custom_show>
                      <tr>
                        <th
                            scope="row"
                            :width="'20%'"
                        >
                          {{ $t('Global.name_custom') }}
                        </th>
                        <td>
                          <div>
                            <b-form-group
                                label-for="name-input"
                            >
                              <validation-provider
                                  #default="{ errors }"
                                  name="English Name input"
                                  rules="english|required"
                              >
                                <b-form-input
                                    id="name-input"
                                    v-model="formPaymentSetting.name"
                                    @keypress="sanitizeEnglish($event)"
                                />
                                <ValidationErrors
                                    :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata,'name')"
                                />
                              </validation-provider>
                            </b-form-group>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th
                            scope="row"
                            :width="'20%'"
                        >
                          {{ $t('Global.arabic_name') }}
                        </th>
                        <td>
                          <div>
                            <b-form-group
                                label-for="nameAr-input"
                            >
                              <validation-provider
                                  #default="{ errors }"
                                  name="Arabic Name input"
                                  rules="arabic|required"
                              >
                                <b-form-input
                                    id="nameAr-input"
                                    v-model="formPaymentSetting.name_local"
                                    :style="$i18n.locale =='en' ? 'text-align: end':'' "
                                    @keypress="sanitizeArabic($event)"
                                />
                                <ValidationErrors
                                    :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata,'name_local')"
                                />
                              </validation-provider>
                            </b-form-group>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </list>
                </b-col>
              </div>
              <hr>
              <div>
                <h4>
                  {{ $t('Fees') }}
                </h4>
                <table
                    v-if="formInstallments"
                    :class="separator ? 'separator' : ''"
                    class="table table-striped custom_table text_nobreak"
                >
                  <thead>
                  <th> </th>
                  <th> {{ $t('egy_pound') }} </th>
                  <th> {{ $t('usd_dollar') }} </th>
                  </thead>
                  <tbody style="text-align: initial">
                  <tr>
                    <td>
                      {{ $t('insurance_fees') }}
                    </td>
                    <td>
                      <b-form-group
                          class="left_right"
                      >
                        <validation-provider
                            #default="{ errors }"
                            rules="required|number"
                        >
                          <b-form-input
                              v-if="reRenderTotal"
                              v-model="formInstallments[0].value_local"
                              type="number"
                              :state="errors.length > 0 ? false : null"
                          />
                          <ValidationErrors
                              :frontend-errors="errors"
                              :backend-errors="getBackendFieldError(errorsdata, 'first_installment_value_local')"
                          />
                        </validation-provider>
                      </b-form-group>
                    </td>
                    <td>
                      <b-form-group
                          class="left_right"
                      >
                        <validation-provider
                            #default="{ errors }"
                            rules="required|number"
                        >
                          <b-form-input
                              v-if="reRenderTotal"
                              v-model="formInstallments[0].value_usd"
                              type="number"
                              :state="errors.length > 0 ? false : null"
                          />
                          <ValidationErrors
                              :frontend-errors="errors"
                              :backend-errors="getBackendFieldError(errorsdata, 'first_installment_value_usd')"
                          />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {{ $t('fees') }}
                    </td>
                    <td>
                      <b-form-group
                          class="left_right"
                      >
                        <validation-provider
                            #default="{ errors }"
                            rules="required|number"
                        >
                          <b-form-input
                              v-if="reRenderTotal"
                              v-model="formInstallments[1].value_local"
                              type="number"
                              :state="errors.length > 0 ? false : null"
                              @blur="changeInstallmentValueNew('value_local',1)"
                              :disabled="true"
                          />
                          <ValidationErrors
                              :frontend-errors="errors"
                              :backend-errors="getBackendFieldError(errorsdata, 'second_installment_value_local')"
                          />
                        </validation-provider>
                      </b-form-group>
                    </td>
                    <td>
                      <b-form-group
                          class="left_right"
                      >
                        <validation-provider
                            #default="{ errors }"
                            rules="required|number"
                        >
                          <b-form-input
                              v-if="reRenderTotal"
                              v-model="formInstallments[1].value_usd"
                              type="number"
                              :state="errors.length > 0 ? false : null"
                              @blur="changeInstallmentValueNew('value_usd',1)"
                              :disabled="true"
                          />
                          <ValidationErrors
                              :frontend-errors="errors"
                              :backend-errors="getBackendFieldError(errorsdata, 'second_installment_value_usd')"
                          />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <hr>
              <div>
                <h4>
                  {{ $t('services_details') }}
                </h4>
                <table
                    :class="separator ? 'separator' : ''"
                    class="table table-striped custom_table text_nobreak"
                >
                  <thead>
                  <th width="350px"> {{ $t('service_name') }} </th>
                  <th> {{ $t('egy_pound') }} </th>
                  <th> {{ $t('usd_dollar') }} </th>
                  <th></th>
                  </thead>
                  <tbody
                      v-if="reRender && formServices"
                      style="text-align: initial"
                  >
                  <tr
                      v-for="(field,index) in formServices"
                      :key="index"
                  >
                    <td v-if="formServices[index]">
                      <b-form-group>
                        <validation-provider
                            #default="{ errors }"
                            rules="required"
                        >
                          <v-select
                              v-model="formServices[index].payment_account_id"
                              :dir="$i18n.locale != 'en' ? 'rtl' : 'ltr'"
                              :label="$i18n.locale == 'en' ? 'name':'name_local'"
                              :options="lookupPaymentAccounts"
                              :reduce="val => val.id"
                              :selectable=" val => checkServiceSelected(val.id)"
                          >
                            <template #option="{ name,name_local }">
                              {{ getTranslatedNameFromObject({ name,name_local }) }}
                            </template>
                            <template #selected-option="{ name, name_local }">
                              {{ getTranslatedNameFromObject({ name,name_local }) }}
                            </template>
                            <template #no-options>
                              {{ $t('noMatching') }}
                            </template>
                          </v-select>
                          <ValidationErrors :frontend-errors="errors" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                    <td v-if="formServices[index]">
                      <b-form-group
                          class="left_right"
                      >
                        <b-form-input
                            v-model="formServices[index].value_local"
                            type="number"
                            @blur="changeServiceValueNew()"
                        />
                      </b-form-group>
                    </td>
                    <td v-if="formServices[index]">
                      <b-form-group
                          class="left_right"
                      >
                        <b-form-input
                            v-model="formServices[index].value_usd"
                            type="number"
                            @blur="changeServiceValueNew()"
                        />
                      </b-form-group>
                    </td>
                    <td v-if="formServices[index]">
                      <feather-icon v-b-tooltip.hover="$t('Global.delete')" icon="Trash2Icon" style="cursor: pointer" class="text-danger" @click="removeCard(index)" />
                    </td>
                  </tr>
                  </tbody>
                  <tfoot>
                  <th> {{ $t('total') }} </th>
                  <th> {{ totalSumServices.totalLocal }} </th>
                  <th> {{ totalSumServices.totalUsd }} </th>
                  <th></th>
                  </tfoot>
                </table>
                <b-button
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    class="mt-1 mb-1"
                    variant="outline-primary"
                    @click="addNewCard"
                >
                  <feather-icon
                      icon="PlusIcon"
                      class="text-md-right"
                  />
                  {{ $t('Add New Accounting Item') }}
                </b-button>
              </div>
            </b-card>
          </b-overlay>
        </b-col>

        <b-row>
          <!-- submit and reset -->
          <b-col
              md="12"
              style="text-align:end"
          >
            <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                :disabled="saveLoading"
            >
              <b-spinner
                  v-if="saveLoading"
                  small
              />
              {{ $t('Global.save') }}
            </b-button>
            <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
                @click="$emit('hideModal')"
            >
              {{ $t('Global.cancel') }}
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  BRow, BCol, BFormGroup, BFormInput, BForm, BButton, BOverlay, BCard, BCardHeader, BSpinner,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import ValidationErrors from '@/views/components/common/ValidationErrors'
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import { required } from '@validations'
import ShowComponent from '@/views/components/info/show'

export default {
  title: 'EditTuitionFeesLevel',
  components: {
    BCol,
    ShowComponent,
    BRow,
    BFormGroup,
    BFormInput,
    ValidationErrors,
    BForm,
    BButton,
    vSelect,
    ValidationProvider,
    ValidationObserver,
    localize,
    BOverlay,
    BCard,
    BCardHeader,
    BOverlay,
    BSpinner,
  },
  directives: {
    Ripple,
  },
  props: {
    inline: { default: false, Type: Boolean },
    data: {
      default: null,
      type: [Array, Object],
    },
    separator: Boolean,
    loading: {
      default: false,
      type: Boolean,
    },
    yearId: {
      default: null,
      type: String,
    },
    paymentSettingId: {
      default: null,
      type: Number,
    },
    lookupPaymentAccounts: {
      default: null,
      type: Array,
    },
  },
  data() {
    return {
      errorsdata: {},
      message: null,
      formPaymentSetting: {
        name: null,
        name_local: null,
        value_local: null,
        value_usd: null,
      },
      formInstallments: [
        {
          id: null,
          value_local: null,
          value_usd: null,
        },
        {
          id: null,
          value_local: null,
          value_usd: null,
        },
      ],
      formServices: [],
      totalSumServices: {
        totalLocal: 0,
        totalUsd: 0,
      },
      formServicesRemoved: [],
      saveLoading: false,
      reRender: true,
      reRenderTotal: true,
    }
  },
  computed: {
    ...mapGetters({
      lookups: 'app/lookups',
    }),
    formServicesIds() {
      return this.formServices.map(obj => obj.payment_account_id)
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions({
      updatePaymentSetting: 'yearPayments/updatePaymentSetting',
      getLookups: 'app/GET_LOOKUPS',
    }),
    init() {
      if (this.data) {
        this.formPaymentSetting = {
          faculty_id: this.data.payment_setting.faculty_id,
          program_id: this.data.payment_setting.program_id,
          value_local: this.data.payment_setting.value_local,
          value_usd: this.data.payment_setting.value_usd,
        }
        this.data.payment_setting.payment_accounts.forEach((item, index) => {
          this.formServices[index] = {
            payment_account_id: item.id,
            payment_setting_account_id: item.pivot.id,
            value_local: item.pivot.value_local,
            value_usd: item.pivot.value_usd,
          }
          this.totalSumServices.totalLocal += item.pivot.value_local
          this.totalSumServices.totalUsd += item.pivot.value_usd
        })

        // for installment
        this.data.payment_installments.forEach((item, index) => {
          this.formInstallments[index] = {
            id: item.id,
            value_local: item.value_local,
            value_usd: item.value_usd,
          }
        })
      }
    },
    save() {
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          this.saveLoading = true
          const payload = {
            yearId: this.yearId,
            paymentSettingId: this.paymentSettingId,
            data: {
              form_payment_setting: this.formPaymentSetting,
              form_installments: this.formInstallments,
              form_services: Object.values(this.formServices),
              form_services_removed: this.formServicesRemoved,
            },
          }
          this.updatePaymentSetting(payload).then(response => {
            this.$swal({
              icon: 'success',
              title: `${this.$t('Global.saved')}`,
              showConfirmButton: false,
              timer: 1500,
            })
            this.$emit('refresh')
            this.$emit('hideModal')
          })
          .catch(error => {
            const errors = [error.response.data.errors]
            errors.forEach((error, index) => {
              this.errorsdata = error
            })
          }).finally(() => {
            this.saveLoading = false
          })
        }
      })
    },
    cancel() {
      if (!this.$route.params.id) {
        this.$router.go(-1)
      } else if (this.inline) {
        return this.$emit('hide')
      }
      return null
    },
    changeServiceValueNew() {
      this.reRenderTotal = false
      this.totalSumServices = {
        totalLocal: 0,
        totalUsd: 0,
      }
      this.formServices.forEach((item, index) => {
        if (item.value_local) {
          this.totalSumServices.totalLocal += parseInt(item.value_local)
          this.formInstallments[1].value_local = this.totalSumServices.totalLocal
        }
        if (item.value_usd) {
          this.totalSumServices.totalUsd += parseInt(item.value_usd)
          this.formInstallments[1].value_usd = this.totalSumServices.totalUsd
        }
      })
      this.reRenderTotal = true
    },
    changeInstallmentValueNew(key,installmentIndex) {
      this.reRenderTotal = false
      switch (key){
        case 'value_local':
          this.handleNewInstallmentCalculation(this.formInstallments,this.totalSumServices.totalLocal,'value_local',installmentIndex);
          break;
        case 'value_usd':
          this.handleNewInstallmentCalculation(this.formInstallments,this.totalSumServices.totalUsd,'value_usd',installmentIndex)
          break;
      }
      this.reRenderTotal = true
    },
    addNewCard() {
      this.reRender = false
      this.formServices.push({
        payment_account_id: null,
        payment_setting_account_id: null,
        value_local: 0,
        value_usd: 0,
      })
      this.reRender = true
    },
    removeCard(index) {
      this.reRender = false
      const removedItem = this.formServices[index].payment_setting_account_id;
      if(removedItem){
        this.formServicesRemoved.push(removedItem)
      }
      delete this.formServices[index]
      this.reRender = true
    },
    checkServiceSelected(id) {
      return !this.formServicesIds.includes(id)
    },
  },
  watch: {
  },
}
</script>

<style lang="scss">
.card-body .tabs{
  overflow: visible !important;
}
</style>
