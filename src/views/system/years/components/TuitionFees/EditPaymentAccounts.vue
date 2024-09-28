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
            <b-card>
              <b-card-header class="mt-0 pt-0 pb-0 p-0">
                <div class="mt-0 d-flex align-items-center">
                  <h3>
                    {{ $t('services_details') }}
                  </h3>
                </div>
              </b-card-header>
              <div>
                <table
                  :class="separator ? 'separator' : ''"
                  class="table table-striped custom_table text_nobreak"
                >
                  <thead>
                    <th width="350px">
                      {{ $t('service_name') }}
                    </th>
                    <th>
                      {{ $t('is_administrative') }}
                    </th>
                    <th />
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
                              v-if="reRender"
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
                          <b-form-checkbox
                            v-model="formServices[index].is_administrative"
                          />
                        </b-form-group>
                      </td>
                      <td v-if="formServices[index]">
                        <feather-icon
                          v-if="formServices[index].can_removed"
                          v-b-tooltip.hover="$t('Global.delete')"
                          icon="Trash2Icon"
                          style="cursor: pointer"
                          class="text-danger"
                          @click="removeCard(index)"
                        />
                      </td>
                    </tr>
                  </tbody>
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
  BRow, BCol, BFormGroup, BFormInput, BForm, BButton, BOverlay, BCard, BCardHeader, BSpinner, BFormCheckbox
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import ValidationErrors from '@/views/components/common/ValidationErrors'
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import { required } from '@validations'
import ShowComponent from '@/views/components/info/show'
import List from '@/views/components/info/list'

export default {
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
    List,
    BFormCheckbox,
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
    tuitionType: {
      default: null,
      type: String,
    },
  },
  data() {
    return {
      errorsdata: {},
      message: null,
      formServices: [],
      formServicesRemoved: [],
      saveLoading: false,
      reRender: true,
      selected: [],
      lookups: null,
      lookupPaymentAccountsAll: [],
    }
  },
  computed: {
    lookupPaymentAccounts() {
      //return this.lookupPaymentAccountsAll.filter(obj => !this.formServicesIds.includes(obj.id))
      return this.lookupPaymentAccountsAll
    },
    formServicesIds() {
      return this.formServices.map(obj => obj.payment_account_id)
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions({
      getTuitionPaymentAccounts: 'yearPayments/getTuitionPaymentAccounts',
      updateTuitionPaymentAccounts: 'yearPayments/updateTuitionPaymentAccounts',
      getLookups: 'app/GET_LOOKUPS',
    }),

    init() {
      // get tuition fees payment accounts
      const payload = {
        yearId: this.yearId,
        type: this.tuitionType,
      }
      this.getTuitionPaymentAccounts(payload).then(data => {
        this.formServices = []
        data.forEach(value => {
          this.formServices.push({
            payment_account_id: value.payment_account_id,
            is_administrative: !!value.is_administrative,
            can_removed: value.value_local === 0 && value.value_usd === 0,
          })
        })
      })

      // get payment accounts lookup
      const lookupPayload = {
        payment_accounts: true,
      }
      this.getLookups(lookupPayload).then(data => {
        this.lookups = data.success
        this.lookupPaymentAccountsAll = this.lookups.payment_accounts
      })
    },

    save() {
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          this.saveLoading = true
          const payload = {
            yearId: this.yearId,
            type: this.tuitionType,
            data: {
              form_services: Object.values(this.formServices),
              form_services_removed: this.formServicesRemoved,
            },
          }
          this.updateTuitionPaymentAccounts(payload).then(response => {
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
    addNewCard() {
      this.reRender = false
      this.formServices.push({
        payment_account_id: null,
        is_administrative: null,
        can_removed: true,
      })
      this.reRender = true
    },
    removeCard(index) {
      this.reRender = false
      const removedItem = this.formServices[index].payment_account_id
      if (removedItem) {
        this.formServicesRemoved.push(removedItem)
      }
      delete this.formServices[index]

      this.reRender = true
    },
    checkServiceSelected(id) {
      return !this.formServicesIds.includes(id)
    },
  },
  watch: {},
}
</script>

<style lang="scss">
.card-body .tabs{
  overflow: visible !important;
}
</style>
