<template>
  <div>
    <div v-if="!load">
      <div v-if="!load && dataInput">
        <div>
          <div>
            <div v-if="!isEditMode">
              <div class="d-flex justify-content-end align-items-center">
                <div class="mb-2">
                  <feather-icon
                      v-b-tooltip.hover="$t('Global.edit')"
                      style="cursor: pointer"
                      icon="EditIcon"
                      class="font-medium-3 text-primary"
                      @click="
                (e) => {
                  editMode('personal_info');
                }
              "
                  />
                </div>
              </div>
            </div>
            <div v-else-if="isEditMode">
              <div class="d-flex justify-content-end align-items-center">
                <div class="mb-2">
                  <feather-icon
                      v-b-tooltip.hover="$t('Global.close')"
                      style="cursor: pointer"
                      icon="XCircleIcon"
                      class="font-medium-3 text-primary"
                      @click="
                (e) => {
                  editMode();
                }
              "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="new-edit" v-if="isEditMode">
          <validation-observer ref="simpleRules">
            <b-form
              ref="form"
              @submit.stop.prevent="save()"
            >
              <b-row>
                <b-col
                    md="12"
                >
                  <list
                      style="padding: 0 !important"
                      :data="form"
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
                                    v-model="form.name"
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
                                    v-model="form.name_local"
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
                      <tr>
                        <th
                            scope="row"
                            :width="'20%'"
                        >
                          {{ $t('amount_usd') }}
                        </th>
                        <td>
                          <div>
                            <b-form-group

                                label-for="amount-input"
                            >
                              <validation-provider
                                  #default="{ errors }"
                                  name="Amount input"
                                  rules="required|integer"
                              >
                                <b-form-input
                                    id="amount-input"
                                    v-model="form.amount"
                                />
                                <ValidationErrors
                                    :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata,'amount')"
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
                          {{ $t('amount_egp') }}
                        </th>
                        <td>
                          <div>
                            <b-form-group
                                label-for="amount_local-input"
                            >
                              <validation-provider
                                  #default="{ errors }"
                                  name="Local Amount Name input"
                                  rules="integer|required"
                              >
                                <b-form-input
                                    id="amount_local-input"
                                    v-model="form.local_amount"
                                />
                                <ValidationErrors
                                    :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata,'local_amount')"
                                />
                              </validation-provider>
                            </b-form-group>
                          </div>
                        </td>
                      </tr>

                    </template>
                  </list>
                </b-col>
                <b-col
                    md="12"
                    v-if="lookups"
                >
                  <list
                      style="padding: 0 !important"
                      :data="form"
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
                          {{ $t('Signature1') }}
                        </th>
                        <td>
                          <div>
                            <b-form-group>
                              <validation-provider
                                  #default="{ errors }"
                                  name="Signature 1 input"
                                  rules="required"
                              >
                                <v-select
                                    v-model="selected[0]"
                                    :dir="$i18n.locale != 'en' ? 'rtl' : 'ltr'"
                                    :label="$i18n.locale == 'en' ? 'name':'name_local'"
                                    :options="computed_items1"
                                    :reduce="val => val.id"
                                >
                                  <template #option="{ name,name_local }">
                                    {{ $i18n.locale == 'en' ? name : name_local }}
                                  </template>
                                  <template #selected-option="{ name, name_local }">
                                    {{ $i18n.locale == 'en' ? name : name_local }}
                                  </template>
                                  <template #no-options>
                                    {{ $t('noMatching') }}
                                  </template>
                                </v-select>
                                <ValidationErrors
                                    :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata,'selected')"
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
                          {{ $t('Signature2') }}
                        </th>
                        <td>
                          <div>
                            <b-form-group>
                              <validation-provider
                                  #default="{ errors }"
                                  name="Signature 2 input"
                                  rules="required"
                              >
                                <v-select
                                    v-model="selected[1]"
                                    :dir="$i18n.locale != 'en' ? 'rtl' : 'ltr'"
                                    :label="$i18n.locale == 'en' ? 'name':'name_local'"
                                    :options="computed_items2"
                                    :reduce="val => val.id"
                                >

                                  <template #option="{ name ,name_local}">
                                    {{ $i18n.locale == 'en' ? name : name_local }}
                                  </template>
                                  <template #selected-option="{ name, name_local }">
                                    {{ $i18n.locale == 'en' ? name : name_local }}
                                  </template>
                                  <template #no-options>
                                    {{ $t('noMatching') }}
                                  </template>
                                </v-select>
                                <ValidationErrors
                                    :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata,'selected')"
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
                          {{ $t('Signature3') }}
                        </th>
                        <td>
                          <div>
                            <b-form-group>
                              <validation-provider
                                  #default="{ errors }"
                                  name="Signature 3 input"
                                  rules="required"
                              >
                                <v-select
                                    v-model="selected[2]"
                                    :dir="$i18n.locale != 'en' ? 'rtl' : 'ltr'"
                                    :label="$i18n.locale == 'en' ? 'name':'name_local'"
                                    :options="computed_items3"
                                    :reduce="val => val.id"
                                >
                                  <template #option="{ name ,name_local}">
                                    {{ $i18n.locale == 'en' ? name : name_local }}
                                  </template>
                                  <template #selected-option="{ name, name_local }">
                                    {{ $i18n.locale == 'en' ? name : name_local }}
                                  </template>
                                  <template #no-options>
                                    {{ $t('noMatching') }}
                                  </template>
                                </v-select>
                                <ValidationErrors
                                    :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata,'selected')"
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
                          {{ $t('Signature4') }}
                        </th>
                        <td>
                          <div>
                            <b-form-group>
                              <validation-provider
                                  #default="{ errors }"
                                  name="Flags input"
                              >
                                <v-select
                                    v-model="selected[3]"
                                    :dir="$i18n.locale != 'en' ? 'rtl' : 'ltr'"
                                    :label="$i18n.locale == 'en' ? 'name':'name_local'"
                                    :options="computed_items4"
                                    :reduce="val => val.id"
                                >

                                  <template #option="{ name ,name_local}">
                                    {{ $i18n.locale == 'en' ? name : name_local }}
                                  </template>
                                  <template #selected-option="{ name, name_local }">
                                    {{ $i18n.locale == 'en' ? name : name_local }}
                                  </template>
                                  <template #no-options>
                                    {{ $t('noMatching') }}
                                  </template>
                                </v-select>
                                <ValidationErrors
                                    :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata,'flags')"
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
                          {{ $t('available_to') }}
                        </th>
                        <td>
                          <div>
                            <b-form-group>
                              <validation-provider
                                  #default="{ errors }"
                                  name="Flags input"
                                  rules="required"
                              >
                                <v-select
                                    v-model="form.flags"
                                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                    :label="$i18n.locale == 'en' ? 'name':'name_local'"
                                    :options="lookups.flags"
                                    :reduce="val => val.name"
                                >

                                  <template #option="{ name,name_local }">
                                    {{ $i18n.locale == 'en' ? name : name_local }}
                                  </template>
                                  <template #selected-option="{ name, name_local }">
                                    {{ $i18n.locale == 'en' ? name : name_local }}
                                  </template>
                                  <template #no-options>
                                    {{ $t('noMatching') }}
                                  </template>
                                </v-select>
                                <ValidationErrors
                                    :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata,'flags')"
                                />
                              </validation-provider>
                            </b-form-group>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </list>
                </b-col>
              </b-row>
              <b-row>
                <!-- submit and reset -->
                <b-col
                  class="mt-3"
                  sm="12"
                  md="12"
                >
                  <b-button
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    type="submit"
                    variant="primary"
                    class="mr-1"
                  >
                    {{ $t('Global.save') }}
                  </b-button>
                  <b-button
                      v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                      variant="outline-secondary"
                      @click="emitsClick()"
                  >
                    {{ $t("Global.cancel") }}
                  </b-button>
                </b-col>
              </b-row>
            </b-form>
          </validation-observer>
        </div>
        <div class="new-edit" v-if="!isEditMode">
              <b-row>
                <b-col
                    md="12"
                >
                  <list
                      style="padding: 0 !important"
                      :data="form"
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
                            {{form.name}}
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
                              {{form.name_local}}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th
                            scope="row"
                            :width="'20%'"
                        >
                          {{ $t('amount_usd') }}
                        </th>
                        <td>
                          <div>
                          {{form.amount}}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th
                            scope="row"
                            :width="'20%'"
                        >
                          {{ $t('amount_egp') }}
                        </th>
                        <td>
                          <div>
                           {{form.local_amount}}
                          </div>
                        </td>
                      </tr>
                    </template>
                  </list>
                </b-col>
                <b-col
                    md="12"
                    v-if="lookups"
                >
                  <list
                      style="padding: 0 !important"
                      :data="form"
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
                          {{ $t('Signature1') }}
                        </th>
                        <td>
                          <div>
                                <v-select
                                    v-model="selected[0]"
                                    :dir="$i18n.locale != 'en' ? 'rtl' : 'ltr'"
                                    :label="$i18n.locale == 'en' ? 'name':'name_local'"
                                    :options="computed_items1"
                                    :reduce="val => val.id"
                                    :disabled="true"
                                >
                                  <template #option="{ name,name_local }">
                                    {{ $i18n.locale == 'en' ? name : name_local }}
                                  </template>
                                  <template #selected-option="{ name, name_local }">
                                    {{ $i18n.locale == 'en' ? name : name_local }}
                                  </template>
                                  <template #no-options>
                                    {{ $t('noMatching') }}
                                  </template>
                                </v-select>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th
                            scope="row"
                            :width="'20%'"
                        >
                          {{ $t('Signature2') }}
                        </th>
                        <td>
                          <div>
                                <v-select
                                    v-model="selected[1]"
                                    :dir="$i18n.locale != 'en' ? 'rtl' : 'ltr'"
                                    :label="$i18n.locale == 'en' ? 'name':'name_local'"
                                    :options="computed_items2"
                                    :reduce="val => val.id"
                                    :disabled="true"
                                >

                                  <template #option="{ name ,name_local}">
                                    {{ $i18n.locale == 'en' ? name : name_local }}
                                  </template>
                                  <template #selected-option="{ name, name_local }">
                                    {{ $i18n.locale == 'en' ? name : name_local }}
                                  </template>
                                  <template #no-options>
                                    {{ $t('noMatching') }}
                                  </template>
                                </v-select>
                                <ValidationErrors
                                    :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata,'selected')"
                                />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th
                            scope="row"
                            :width="'20%'"
                        >
                          {{ $t('Signature3') }}
                        </th>
                        <td>
                          <div>
                                <v-select
                                    v-model="selected[2]"
                                    :dir="$i18n.locale != 'en' ? 'rtl' : 'ltr'"
                                    :label="$i18n.locale == 'en' ? 'name':'name_local'"
                                    :options="computed_items3"
                                    :reduce="val => val.id"
                                    :disabled="true"
                                >
                                  <template #option="{ name ,name_local}">
                                    {{ $i18n.locale == 'en' ? name : name_local }}
                                  </template>
                                  <template #selected-option="{ name, name_local }">
                                    {{ $i18n.locale == 'en' ? name : name_local }}
                                  </template>
                                  <template #no-options>
                                    {{ $t('noMatching') }}
                                  </template>
                                </v-select>
                                <ValidationErrors
                                    :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata,'selected')"
                                />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th
                            scope="row"
                            :width="'20%'"
                        >
                          {{ $t('Signature4') }}
                        </th>
                        <td>
                          <div>
                                <v-select
                                    v-model="selected[3]"
                                    :dir="$i18n.locale != 'en' ? 'rtl' : 'ltr'"
                                    :label="$i18n.locale == 'en' ? 'name':'name_local'"
                                    :options="computed_items4"
                                    :reduce="val => val.id"
                                    :disabled="true"
                                >

                                  <template #option="{ name ,name_local}">
                                    {{ $i18n.locale == 'en' ? name : name_local }}
                                  </template>
                                  <template #selected-option="{ name, name_local }">
                                    {{ $i18n.locale == 'en' ? name : name_local }}
                                  </template>
                                  <template #no-options>
                                    {{ $t('noMatching') }}
                                  </template>
                                </v-select>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th
                            scope="row"
                            :width="'20%'"
                        >
                          {{ $t('available_to') }}
                        </th>
                        <td>
                          <div>
                                <v-select
                                    v-model="form.flags"
                                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                                    :label="$i18n.locale == 'en' ? 'name':'name_local'"
                                    :options="lookups.flags"
                                    :reduce="val => val.name"
                                    :disabled="true"
                                >

                                  <template #option="{ name,name_local }">
                                    {{ $i18n.locale == 'en' ? name : name_local }}
                                  </template>
                                  <template #selected-option="{ name, name_local }">
                                    {{ $i18n.locale == 'en' ? name : name_local }}
                                  </template>
                                  <template #no-options>
                                    {{ $t('noMatching') }}
                                  </template>
                                </v-select>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </list>
                </b-col>
              </b-row>
              <b-row>
                <!-- submit and reset -->
                <b-col
                    class="mt-3"
                    sm="12"
                    md="12"
                >
                  <b-button
                      v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                      variant="outline-secondary"
                      @click="emitsClick()"
                  >
                    {{ $t("Global.cancel") }}
                  </b-button>
                </b-col>
              </b-row>
        </div>
    </div>
    </div>
    <div
      v-if="load"
      style="
              position: absolute;
              width: 100%;
              top:0;
              bottom: 0;
              left: 0;
              right: 0;
              background-color: #eee;
              opacity: 0.8;
              text-align: center;
              z-index: 999;
              min-height: 450px;
              "
    >
      <b-spinner
        variant="primary"
        style="position: absolute;top: 60px;z-index: 1000;"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  BButton, BCard, BCol, BForm, BFormCheckbox, BFormGroup, BFormInput, BLink, BRow, BSpinner,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import { localize, ValidationObserver, ValidationProvider } from 'vee-validate'
import EditComponent from '@/views/components/table/Edit'
import {
  required, email, regex, integer,
} from '@validations'
import ValidationErrors from '@/views/components/common/ValidationErrors'
import List from '@/views/components/info/list'
export default {
  title: 'EditCertificateSettings',
  components: {
    EditComponent,
    BCard,
    BCol,
    BRow,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    EditComponent,
    vSelect,
    BLink,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,
    required,
    email,
    integer,
    BSpinner,
    List
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      item: 'certificateSettings/item',
      load: 'certificateSettings/load',

    }),
    computed_items1() {
      const filterType0 = this.selected[0]
      const filterType1 = this.selected[1]
      const filterType2 = this.selected[2]
      const filterType3 = this.selected[3]
      const items = this.lookups.roles
      return items.filter(item => item.id != filterType1 && item.id != filterType2 && item.id != filterType3)
    },
    computed_items2() {
      const filterType0 = this.selected[0]
      const filterType1 = this.selected[1]
      const filterType2 = this.selected[2]
      const filterType3 = this.selected[3]
      const items = this.lookups.roles
      return items.filter(item => item.id != filterType0 && item.id != filterType2 && item.id != filterType3)
    },
    computed_items3() {
      const filterType0 = this.selected[0]
      const filterType1 = this.selected[1]
      const filterType2 = this.selected[2]
      const filterType3 = this.selected[3]
      const items = this.lookups.roles
      return items.filter(item => item.id != filterType0 && item.id != filterType1 && item.id != filterType3)
    },
    computed_items4() {
      const filterType0 = this.selected[0]
      const filterType1 = this.selected[1]
      const filterType2 = this.selected[2]
      const filterType3 = this.selected[3]
      const items = this.lookups.roles
      return items.filter(item => item.id != filterType0 && item.id != filterType1 && item.id != filterType2)
    },
    title() {
      // return this.id ? this.$t('Global.edit_section') +' '+ item.section : this.$t('Global.add_section')
      return this.$t('certificates_settings')
    },
    isEditMode() {
      return this.isEditShow
    },
  },
  props: {
    dataInput: { type: Object },
    year_id: { type: Number },
    isEditShow: { default: false, type: Boolean },
  },
  data() {
    return {
      errorsdata: {},
      form: {
        name: null,
        name_local: null,
      },
      message: null,
      selected: [],
      lookups: null,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions({
      getItem: 'certificateSettings/get',
      getlookups: 'certificateSettings/getlookups',
    }),
    init() {
      this.form = this.dataInput
      this.dataInput.service_roles.forEach(item => {
        this.selected.push(item.id)
      })
      this.getlookups()
        .then(res => {
          this.lookups = res.data.lookups
        })
    },
    save() {
      this.$refs.simpleRules.validate()
        .then(success => {
          if (success) {
            this.form.type = 13
            this.form.services_roles = this.selected
            const query = {
              ...this.form,
              year_id: parseInt(this.year_id),
            }
            const payload = {
              id: this.dataInput.id,
              query,
            }
            this.$store.dispatch('certificateSettings/put', payload)
              .then(response => {
                this.$swal({
                  icon: 'success',
                  title: `${this.$t('Global.saved')}`,
                  showConfirmButton: false,
                  timer: 1500,
                })
                this.$emit('refresh')
                this.$emit('hideModal')
              })
          }
        })
    },
    editMode() {
      this.isEditShow = !this.isEditShow
    },
    emitsClick(){
      this.$emit('refresh', { page: this.$route.query.page })
      this.$emit('hideModal')
    },
  },
}

</script>

<style scoped></style>
