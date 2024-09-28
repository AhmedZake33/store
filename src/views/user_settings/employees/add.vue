<template>
  <b-row class="new_edit" :class="load_data ? 'disabled_all' : ''">
    <b-col cols="12">
      <validation-observer ref="simpleForm">
        <b-form v-if="form" ref="form" @submit.stop.prevent="save">
          <!-- {{ type }}ss -->
          <b-card class="mb-0" :class="load_data ? 'disabled_all' : ''">
            <b-tabs v-model="tabIndex" @input="saveStatus" vertical nav-wrapper-class="nav-hidden" align="left">
              <b-tab>
                <template #title>
                  <div id="personal_info">
                    <feather-icon icon="InfoIcon" />
                    <span>{{ $t('Global.personal_info') }}</span>
                  </div>
                </template>
                <ShowComponent :data="form" :loading="load" :only="['code', 'name', 'name_local', 'id', 'gender', 'birth_date', 'access', 'insurance_no']">
                  <template #edit>
                    <div class="mb-2">
                      <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer" icon="XCircleIcon" class="font-medium-3" @click="cancel()" v-if="hasPermission('edit_users')" />
                    </div>
                  </template>
                  <template #insurance_no="{ data }" v-if="type == 2">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.insurance_no`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-insurance_no">
                        <validation-provider #default="{ errors }" name="insurance_no">
                          <b-form-input @keypress="writeNumber($event)" :state="errors.length > 0 ? false : null" type="tel" id="vi-insurance_no" v-model="form.insurance_no" :placeholder="$t('Global.insurance_no')" />
                          <ValidationErrors default-message :frontend-errors="errors" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #name="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.name_custom`) }}
                    </th>
                    <td>
                      <b-form-group label-for="name-input" invalid-feedback="Name is required">
                        <validation-provider #default="{ errors }" name="name" rules="english|required">
                          <b-form-input
                            :placeholder="$t('Global.english_name')"
                            @keypress="
                              sanitizeEnglish($event);
                              sanitizeNumber($event);
                            "
                            id="name-input"
                            v-model="form.name"
                            :state="errors.length > 0 ? false : null"
                          />
                          <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name')" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #type="{ data }" v-if="$route.name == 'staff-add'">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.type`) }}
                    </th>
                    <td>
                      <validation-provider #default="{ errors }" name="type" rules="required">
                        <b-form-group label-for="vi-gender">
                          <v-select :placeholder="$t('Global.type')" :disabled="type && id ? true : false" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="types" v-model="form.type" :reduce="val => val.type">
                            <template v-slot:option="option">
                              {{ option.label }}
                            </template>
                            <template #selected-option="{ name, name_local, label }">
                              <div style="display: flex; align-items: baseline">
                                <span v-if="$i18n.locale == 'ar'">{{ name_local || label }}</span>
                                <span v-else>{{ name || label }}</span>
                              </div>
                            </template>
                            <template #no-options>
                              {{ $t('noMatching') }}
                            </template>
                          </v-select>
                        </b-form-group>
                        <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.gender'))" />
                      </validation-provider>
                    </td>
                  </template>
                  <template v-else #type="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.type`) }}
                    </th>
                    <td>
                      {{ $i18n.locale == 'en' ? data.type.name : data.type.name_local }}
                    </td>
                  </template>
                  <template #access="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.national_id`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-national-id">
                        <validation-provider #default="{ errors }" name="National ID" :rules="$route.params.id ? 'ssn' : 'ssn|required'">
                          <b-form-input :placeholder="$t('Global.national_id')" :state="errors.length > 0 ? false : null" type="number" id="vi-national-id" v-model="form.national_id" />
                          <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'national_id')" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #code>
                    <th scope="row" :width="'20%'">
                      {{ $t('Global.code') }}
                    </th>
                    <td>
                      <b-form-group v-if="codeKey" label-for="vi-postal-code">
                        <validation-provider #default="{ errors }" name="Code" rules="code">
                          <b-form-input :disabled="canEditCode" :placeholder="$t('Global.code') + ` (${$t('Global.auto_generated')})`" :state="errors.length > 0 ? false : null" id="vi-postal-code" v-model="form.code" />
                          <ValidationErrors noAlert :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'code')" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #birth_date="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.birth_date`) }}
                    </th>
                    <td>
                      <b-form-group label-for="birth_date">
                        <validation-provider #default="{ errors }" name="birth_date" :rules="$route.params.id ? '' : 'required'">
                          <b-form-datepicker :placeholder="$t('Global.birthdate')" :max="maxDate" id="example-datepicker" :locale="$i18n.locale == 'ar' ? 'ar' : 'en'" :label-no-date-selected="$t('Global.no_selected')" v-model="form.birth_date" :state="errors.length > 0 ? false : null" class="mb-1" />
                          <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #gender="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.gender`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-gender">
                        <validation-provider #default="{ errors }" name="gender" rules="required">
                          <v-select :placeholder="$t('Global.gender')" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="genders" v-model="form.gender" :reduce="val => val.id">
                            <template v-slot:option="option">
                              {{ option.label }}
                            </template>
                            <template #selected-option="{ label }">
                              <div style="display: flex; align-items: baseline">
                                <span>{{ typeof label == 'string' ? $t(`Global.${label}`) : label }} </span>
                              </div>
                            </template>
                            <template #no-options>
                              {{ $t('noMatching') }}
                            </template>
                          </v-select>
                          <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.gender'))" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>

                  <template #name_local="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.arabic_name`) }}
                    </th>
                    <td>
                      <b-form-group label-for="nameAr-input" invalid-feedback="Name is required">
                        <validation-provider #default="{ errors }" name="name_local" rules="arabic|required">
                          <b-form-input
                            :placeholder="$t('Global.arabic_name')"
                            @keypress="
                              sanitizeArabic($event);
                              sanitizeNumber($event);
                            "
                            id="nameAr-input"
                            v-model="form.name_local"
                            :state="errors.length > 0 ? false : null"
                          />
                          <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name_local')" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #id="{ data }">
                    <th v-if="$i18n.locale == 'en'" scope="row" :width="'20%'">
                      {{ $t(`Global.name_local`) }}
                    </th>
                    <td v-if="$i18n.locale == 'en'">
                      <b-form-group label-for="nameAr-input" invalid-feedback="Name is required">
                        <validation-provider #default="{ errors }" name="name_local" rules="arabic|required">
                          <b-form-input
                            :placeholder="$t('Global.arabic_name')"
                            @keypress="
                              sanitizeArabic($event);
                              sanitizeNumber($event);
                            "
                            id="nameAr-input"
                            v-model="form.name_local"
                            :state="errors.length > 0 ? false : null"
                          />
                          <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name_local')" />
                        </validation-provider>
                      </b-form-group>
                    </td>

                    <th v-if="$i18n.locale == 'ar'" scope="row" :width="'20%'">الاسم بالانجليزية</th>
                    <td v-if="$i18n.locale == 'ar'">
                      <b-form-group label-for="name-input" invalid-feedback="Name is required">
                        <validation-provider #default="{ errors }" name="name" rules="english|required">
                          <b-form-input
                            :placeholder="$t('Global.english_name')"
                            @keypress="
                              sanitizeEnglish($event);
                              sanitizeNumber($event);
                            "
                            id="name-input"
                            v-model="form.name"
                            :state="errors.length > 0 ? false : null"
                          />
                          <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name')" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                </ShowComponent>
                <b-row>
                  <b-col md="12">
                    <b-button @click="save" variant="primary" class="mr-1">
                      {{ $t('Global.save') }}
                    </b-button>
                    <b-button type="reset" variant="outline-secondary" @click="cancel">
                      {{ $t('Global.cancel') }}
                    </b-button>
                  </b-col>
                </b-row>
              </b-tab>
              <b-tab>
                <template #title>
                  <div id="contact_info">
                    <feather-icon icon="PhoneIcon" />
                    <span>{{ $t('Global.contact_info') }}</span>
                  </div>
                </template>
                <ShowComponent v-show="$route.name != 'user-show' || (tabNumber == 1 && type != 1) || (type == 1 && $route.name == 'user-show' && tabNumber == 1)" :data="form" :loading="load" :only="['email', 'personal_email', 'mobile', 'phone', 'internal_phone']">
                  <template #edit>
                    <div class="mb-2">
                      <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer" icon="XCircleIcon" class="font-medium-3" @click="cancel()" v-if="hasPermission('edit_users')" />
                    </div>
                  </template>
                  <template #email="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`academic_email`) }}
                    </th>
                    <td>
                      <b-form-group label-for="email">
                        <validation-provider #default="{ errors }" :rules="$route.params.id ? 'email' : 'email|required'" name="email">
                          <b-form-input :disabled="canEditAcademicEmail" :placeholder="$t('academic_email')" :state="errors.length > 0 ? false : null" id="vi-email" type="email" v-model="form.email" />
                          <ValidationErrors noAlert :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'email')" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #mobile="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.mobile`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-mobile">
                        <validation-provider #default="{ errors }" rules="mobile" name="mobile">
                          <b-form-input :placeholder="$t('Global.mobile')" @keypress="writeNumber($event)" :state="errors.length > 0 ? false : null" id="vi-mobile" v-model="form.mobile" />
                          <ValidationErrors :frontend-errors="errors" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #phone="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.phone`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-phone">
                        <validation-provider #default="{ errors }" rules="" name="phone">
                          <b-form-input :placeholder="$t('Global.phone')" @keypress="writeNumber($event)" :state="errors.length > 0 ? false : null" type="tel" id="vi-phone" v-model="form.phone" />
                          <ValidationErrors :frontend-errors="errors" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #personal_email="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.personal_email`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-personal-email">
                        <validation-provider #default="{ errors }" :rules="$route.params.id ? 'email' : 'email'" name="personal_email">
                          <b-form-input :state="errors.length > 0 ? false : null" id="vi-personal-email" type="email" v-model="form.personal_email" :placeholder="$t('Global.personal_email')" />
                          <ValidationErrors noAlert :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'personal_email')" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>

                  <template #internal_phone="{ data }" v-if="type == 2">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.internal_phone`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-internal_phone">
                        <validation-provider #default="{ errors }" name="internal_phone">
                          <b-form-input @keypress="writeNumber($event)" :state="errors.length > 0 ? false : null" type="tel" id="vi-internal_phone" v-model="form.internal_phone" :placeholder="$t('Global.internal_phone')" />
                          <ValidationErrors default-message :frontend-errors="errors" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                </ShowComponent>
                <b-col md="12">
                  <b-button @click="save" variant="primary" class="mr-1">
                    {{ $t('Global.save') }}
                  </b-button>
                  <b-button type="reset" variant="outline-secondary" @click="cancel">
                    {{ $t('Global.cancel') }}
                  </b-button>
                </b-col>
              </b-tab>
              <b-tab>
                <template #title>
                  <feather-icon icon="MapPinIcon" />
                  <span>{{ $t('Global.address_info') }}</span>
                </template>
                <ShowComponent :data="form" :loading="load" :only="['address', 'postal_code']">
                  <template #edit>
                    <div class="mb-2">
                      <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer" icon="XCircleIcon" class="font-medium-3" @click="cancel()" v-if="hasPermission('edit_users')" />
                    </div>
                  </template>
                  <template #address="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.address_info`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-address">
                        <validation-provider #default="{ errors }" name="Address" rules="address">
                          <b-form-input :state="errors.length > 0 ? false : null" id="vi-address" v-model="form.address" :placeholder="$t('Global.address')" />
                          <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.address'))" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #postal_code="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.postal_code`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-postal-code">
                        <validation-provider #default="{ errors }" name="Postal Code" rules="postal">
                          <b-form-input :placeholder="$t('Global.postal_code')" :state="errors.length > 0 ? false : null" id="vi-postal-code" v-model="form.postal_code" />
                          <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.postal_code'))" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                </ShowComponent>
                <b-col md="12">
                  <b-button @click="save" variant="primary" class="mr-1">
                    {{ $t('Global.save') }}
                  </b-button>
                  <b-button type="reset" variant="outline-secondary" @click="cancel">
                    {{ $t('Global.cancel') }}
                  </b-button>
                </b-col>
              </b-tab>
            </b-tabs>
          </b-card>

          <!-- address -->

          <!-- academic -->

          <!-- social link -->

          <!-- account details tab -->
          <!--                    <tab-content :title="$t('acount_details')" icon="feather icon-file-text">-->
          <!--                        <b-row>-->
          <!--                            <b-col md="12">-->
          <!--                                <b-form-group :label="$t('email')" label-for="vi-email">-->
          <!--                                    <b-form-input id="vi-email" type="email" v-model="form.email"-->
          <!--                                                  placeholder="john.doe@email.com"/>-->
          <!--                                </b-form-group>-->
          <!--                            </b-col>-->
          <!--                            <b-col md="6">-->
          <!--                                <b-form-group :label="$t('Global.password')" label-for="vi-password">-->
          <!--                                    <b-form-input id="vi-password" type="password" v-model="form.password"-->
          <!--                                                  :placeholder="$t('Global.password')"/>-->
          <!--                                </b-form-group>-->
          <!--                            </b-col>-->
          <!--                            <b-col md="6">-->
          <!--                                <b-form-group :label="$t('Global.password_check')" label-for="vi-c-password">-->
          <!--                                    <b-form-input id="vi-c-password" type="password" v-model="form.confirm_password"-->
          <!--                                                  :placeholder="$t('Global.password_check')"/>-->
          <!--                                </b-form-group>-->
          <!--                            </b-col>-->
          <!--                        </b-row>-->
          <!--                    </tab-content>-->
        </b-form>
      </validation-observer>
    </b-col>
  </b-row>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard';
import vSelect from 'vue-select';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import { required, email, digits, length } from '@validations';
import { BRow, BCol, BOverlay, BCard, BTab, BTabs, BForm, BFormGroup, BFormInput, BFormDatepicker, BFormTextarea } from 'bootstrap-vue';
import { localize, ValidationObserver, ValidationProvider } from 'vee-validate';
import ValidationErrors from '@/views/components/common/ValidationErrors';
import { mapActions, mapGetters } from 'vuex';
import ShowComponent from '@/views/components/info/show';
var tempData = Object.freeze({
  name: '',
  name_local: '',
  code: '',
  phone: '',
  id: '',
  insurance_no: '',
  type: '',
  national_id: '',
  gender: '',
  birth_date: '',
  address: '',
  postal_code: '',
  email: '',
  personal_email: '',
  mobile: '',
  internal_phone: '',
  teaching_assistant_at: '',
  professor_at: '',
  teacher_at: '',
  seniority: '',
  msc_from: '',
  msc_from_local: '',
  phd_from: '',
  phd_from_local: '',
  assistant_professor_at: '',
  phd_at: '',
  emeritus_at: '',
  rank: '',
  department: '',
  access: '',
});
export default {
  components: {
    ShowComponent,
    FormWizard,
    BOverlay,
    TabContent,
    BRow,
    BFormDatepicker,
    BCol,
    BForm,
    BFormGroup,
    BCard,
    BFormInput,
    vSelect,
    BFormTextarea,
    ValidationProvider,
    ValidationObserver,
    localize,
    BTabs,
    BTab,
    ValidationErrors,
  },
  computed: {
    ...mapGetters({
      lookups: 'app/lookups',
      user: 'users/item',
      load: 'users/load',
      load_data: 'app/load',
    }),
    canEditCode() {
      if ((this.form.type === 1 && this.hasPermission('edit_code_instructor')) ||
          (this.form.type === 2 && this.hasPermission('edit_code_employee')) ||
          (this.form.type === 3 && this.hasPermission('edit_code_student'))) {
        return false;
      }
      return true;
    },
    canEditAcademicEmail() {
      if ((this.form.type === 1 && this.hasPermission('edit_email_instructor')) ||
          (this.form.type === 2 && this.hasPermission('edit_email_employee')) ||
          (this.form.type === 3 && this.hasPermission('edit_email_student')) || !this.id) {
        return false;
      }
      return true;
    },
    id() {
      return this.$route.params && this.$route.params.id ? this.$route.params.id : null;
    },
    types() {
      return [
        { type: 1, label: this.$t('Global.instructor') },
        { type: 2, label: this.$t('Global.employee') },
        { type: 3, label: this.$t('Global.student') },
      ];
    },
    genders() {
      return [
        { id: 1, label: this.$t('Global.male') },
        { id: 2, label: this.$t('Global.female') },
      ];
    },
  },
  props: {
    type: Number,
    tabNumber: Number,
    userData: { default: {}, type: [Array, Object] },
    // instructorData: { default: {}, type: [Array, Object] },
  },
  data() {
    return {
      errorsdata: {},
      academic_info: false,
      address: false,
      contact: false,
      codeKey: true,
      form: Object.assign({}, tempData),
      query: {
        ranks: true,
        faculties: true,
        employee_types: true,
        faculty_departments: true,
      },
      maxDate: null,
    };
  },

  mounted() {
    this.init();
    let now = new Date()
    this.maxDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  },
  watch: {
    'form.faculty_id'(val, old) {
      if (old) {
        this.form.department_id = null;
      }
      this.query.faculty_id = val;
      this.getLookups(this.query);
    },
    'form.phone'(val) {
      this.form.phone = val ? val.toString().replace(/[^0-9]/g, '') : null;
    },
    'form.code'(val) {
      if (this.form.code.length > 8) {
        this.form.code = this.form.code.slice(0, -1);
        this.codeKey = false;
        setTimeout(() => {
          this.codeKey = true;
        }, 10);
      }
    },
  },
  methods: {
    ...mapActions({
      getLookups: 'app/GET_LOOKUPS',
      saveUser: 'users/put',
    }),
    saveStatus(index) {
      this.updateFilterQueryParams({ tabNum: index });
    },
    cancel() {
      if (!this.id) {
        this.$router.go(-1);
      }
      this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: false });
      return this.$emit('hideEdit');
      // if (this.$route.params.id) {
      //   this.$router.push({ name: 'program', params: { id: this.$route.params.id } });
      // } else {
      //   this.$router.push({ name: 'programs' });
      // }
    },
    // changeTab(pre, next) {
    //   if (next == 1) {
    //     this.academic_info = true;
    //   } else {
    //     this.academic_info = false;
    //   }
    //   if ((this.type == 1 && next == 2) || (this.type != 1 && next == 1)) {
    //     this.contact = true;
    //   } else {
    //     this.contact = false;
    //   }
    //   if ((this.type == 1 && next == 3) || (this.type != 1 && next == 2)) {
    //     this.address = true;
    //   } else {
    //     this.address = false;
    //   }
    // },

    validateAsync: function (index) {
      if (this.$route.params.id && this.type == 1) return true;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.$refs.simpleForm.validate().then(success => {
            if (success) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        }, 1000);
      });
    },

    init() {
      this.getLookups(this.query).then(_ => {
        // this.form = { type: this.type };
        if (this.id) {
          // this.$store.dispatch('users/get', this.id).then(_ => {
          // if (this.$route.params.id && this.type == 1) {
          //   var wizard = this.$refs.wizard;
          //   wizard.maxStep = wizard.tabs.length - 1;
          //   wizard.tabs.forEach(tab => {
          //     tab.checked = true;
          //   });
          // }
          // if (this.userData) {
          //   if (this.userData.instructor_data) {
          //     this.form = { ...this.userData, ...this.userData.instructor_data };
          //   } else if (this.userData.employee_data) {
          //     this.form = { ...this.userData, ...this.userData.employee_data };
          //   } else {
          //     this.form = Object.assign({}, this.userData);
          //   }
          //   // this.form.name_local = this.user.name_local;
          //   // this.form.name = this.user.name;
          //   if (this.userData && this.userData.type && this.userData.type.type) {
          //     this.form.type = this.userData?.type?.type;
          //   }
          //   if (this.userData && this.userData.gender && this.userData.gender.id) {
          //     this.form.gender = this.userData?.gender?.id;
          //   }
          // }
          // });
        }
      });
    },

    save() {
      this.$refs.simpleForm.validate().then(success => {
        if (success || (this.$route.params.id)) {
          if (this.id) {
            this.form.type = 1;
          } else if (this.$route.name == 'user-add') {
            delete this.form['id'];
          } else if (this.$route.name == 'staff-add') {
            delete this.form['id'];
            this.form.type = 1;
          } else if (this.$route.name == 'employee-add') {
            delete this.form['id'];
            this.form.type = 2;
          }
          this.form.type = 2;
          delete this.form['employee_type'];
          delete this.form['user'];
          this.$store
            .dispatch('users/put', { id: this.id, query: this.form })
            .then(response => {
              this.$emit('refresh', response.data.id);
              this.$swal({
                icon: 'success',
                title: `${this.$t('Global.saved')}`,
                showConfirmButton: false,
                timer: 1500,
              });
              if (this.$route.params.id) {
              } else {
                this.$emit('hide');
                return this.$router.push({ name: 'employee-show', params: { id: response.data.id } });
              }
            })
            .catch(error => {
              this.errorsdata = this.handleBackendError(error.response.data.errors);
              this.$swal({
                icon: 'error',
                text: `${this.$t('check_form_errors')}`,
                showConfirmButton: false,
                timer: 1500,
              });

              if (this.errorsdata.code) {
                document.getElementById('personal_info').click();
              }
              if (this.errorsdata.email) {
                document.getElementById('contact_info').click();
              }
            });
        } else {
          let spacificErrors = [];
          Object.keys(this.$refs.simpleForm.errors).forEach(key => {
            if (this.$refs.simpleForm.errors[key].length) {
              spacificErrors.push(key);
            }
          });
          this.errorToast(this.$t('check_form_errors') + ' ' + '(' + spacificErrors.map(el => this.$t(`Global.${el}`)) + ')');
          if (this.tabNumber == 0 && this.$route.name == 'employee-add' && this.form.code && this.form.name && this.form.name_local && this.form.national_id && this.form.gender && this.form.birth_date) {
            document.getElementById('contact_info').click();
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-wizard.scss';
@import '@core/scss/vue/libs/vue-select.scss';

.wizard-btn,
.wizard-icon-container {
  background-color: #054978 !important;
  border-color: #054978 !important;
}

.stepTitle.active {
  color: #054978 !important;
}
</style>
