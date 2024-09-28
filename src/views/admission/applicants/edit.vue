<template>
  <div>
    <edit-component
      :name="item ? item.name : '' || 'Edit Applicant'"
      :loading="load"
    >
      <template #inputs>
        <validation-observer ref="simpleRules">
          <b-form>
            <b-row>
              <b-col
                cols="12"
                md="4"
              >
                <b-form-group
                  label="First Name"
                  label-for="first_name"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="first name"
                    rules="required"
                  >
                    <b-form-input
                      id="first_name"
                      v-model="first_name"
                      :state="errors.length > 0 ? false : null"
                      :max-length="first_name_length"
                      placeholder="First Name"
                    />
                    <small
                      v-if="errors.length"
                      class="text-danger"
                    >{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col
                cols="12"
                md="4"
              >
                <b-form-group
                  label="Email"
                  label-for="email"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="email"
                    rules="required|email"
                  >
                    <b-form-input
                      id="email"
                      v-model="email"
                      v-b-popover.hover.top="'example: test.user222@gmail.com'"
                      :state="errors.length > 0 ? false : null"
                      placeholder="Email"
                      type="email"
                    />
                    <small
                      v-if="errors.length"
                      class="text-danger"
                    >{{
                      validation(null, 'email').message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col
                cols="12"
                md="4"
              >
                <b-form-group
                  label="Phone"
                  label-for="phone"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="phone"
                    :rules="'required' | 'length:15' | { regex: /^[0-9]+$/ }"
                  >
                    <b-form-input
                      v-model="mobile"
                      :state="errors.length > 0 ? false : null"
                      type="number"
                    />
                    <small
                      v-if="errors.length"
                      class="text-danger"
                    >{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col md="4">
                <b-form-group
                  label-for="account-new-password"
                  label="Password"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Password"
                    rules="required"
                  >
                    <b-input-group
                      style="margin-top: 9px"
                      class="input-group-merge"
                    >
                      <b-form-input
                        id="account-new-password"
                        v-model="password"
                        v-b-popover.hover.top="'example: Test@2021'"
                        :state="errors.length > 0 ? false : null"
                        :style="checkPassword ? '' : 'border:1px solid red'"
                        max-length="16"
                        autocomplete="new-password"
                        :type="passwordFieldTypeNew"
                        placeholder="New Password"
                        @blur="validatePassword"
                      />

                      <b-input-group-append
                        :class="errors.length > 0 ? 'custom_invalid' : ''"
                        is-text
                      >
                        <feather-icon
                          :icon="passwordToggleIconNew"
                          class="cursor-pointer"
                          @click="togglePasswordNew"
                        />
                      </b-input-group-append>
                    </b-input-group>
                    <small
                      v-if="errors.length"
                      class="text-danger"
                    >{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col md="4">
                <b-form-group label="Gender">
                  <validation-provider
                    #default="{ errors }"
                    :rules="validation(null, 0).rule"
                    name="gender"
                  >
                    <v-select
                      v-model="gender"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      placeholder="Gender"
                      multiple
                      label="name"
                      :reduce="gender => gender.name"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="genders"
                      :clearable="false"
                      @search="fetchOptions"
                    >
                    <template #no-options>
                            {{ $t("search_input_text") }}
                          </template>
                    </v-select>
                    <small
                      v-if="errors.length"
                      class="text-danger"
                    >{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col
                cols="12"
                md="4"
              >
                <b-form-group
                  label="Birthdate"
                  label-for="birthdate"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="birthdate"
                    rules="required"
                  >
                    <b-form-datepicker
                      id="example-datepicker"
                      v-model="birthdate"
                      :state="errors.length > 0 ? false : null"
                      :max="max"
                      :min="min"
                      class="mb-1"
                    />
                    <small
                      v-if="errors.length"
                      class="text-danger"
                    >{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </template>
      <template #footer>
        <b-button
          variant="primary"
          :class="load ? 'disabled_all' : ''"
          class="mb-1 mb-sm-0 mr-0 mr-sm-1"
          :block="$store.getters['app/currentBreakPoint'] === 'xs'"
          @click.prevent="save()"
        >
          Save
        </b-button>
        <b-button
          variant="default"
          :class="load ? 'disabled_all' : ''"
          style="border: 1px solid #000; color: black"
          @click="reset"
        >Reset</b-button>
      </template>
    </edit-component>
  </div>
</template>

<script>
import {
  BTab,
  BTabs,
  BCard,
  BInputGroup,
  BInputGroupAppend,
  BAlert,
  BLink,
  BFormDatepicker,
  BButton,
  BMedia,
  BAvatar,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BForm,
  BCardHeader,
  BCardTitle,
  BImg,
  BSpinner,
  VBTooltip,
  VBPopover,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import { required, email } from '@validations'
import { mapGetters, mapActions } from 'vuex'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import Ripple from 'vue-ripple-directive'
import Cookies from 'js-cookie'
import { validatorPassword } from '@/@core/utils/validations/validators'
import { Auth } from '@/utils/auth'
import EditComponent from '@/views/components/table/Edit'

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BAlert,
    BLink,
    BButton,
    BMedia,
    BAvatar,
    BFormDatepicker,
    ValidationProvider,
    ValidationObserver,
    localize,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BForm,
    BCardHeader,
    BCardTitle,
    vSelect,
    BImg,
    BSpinner,
    BInputGroup,
    BInputGroupAppend,
    VBTooltip,
    VBPopover,
    EditComponent,
  },
  directives: {
    'b-popover': VBPopover,
    'b-tooltip': VBTooltip,
    Ripple,
  },
  computed: {
    passwordToggleIconOld() {
      return this.passwordFieldTypeOld === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    passwordToggleIconNew() {
      return this.passwordFieldTypeNew === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    passwordToggleIconRetype() {
      return this.passwordFieldTypeRetype === 'password'
        ? 'EyeIcon'
        : 'EyeOffIcon'
    },
    ...mapGetters({
      item: 'users/item',
      total: 'users/total',
      load: 'users/load',
      lookups: 'users/lookups',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null
    },
  },
  data() {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    // 15th two months prior
    const minDate = new Date(today)
    minDate.setMonth(minDate.getMonth() - 156)
    minDate.setDate(today.getDate())
    // 15th in two months
    const maxDate = new Date(today)
    // maxDate.setMonth(maxDate.getMonth() + 2)
    // maxDate.setDate(15)
    return {
      first_name: null,
      last_name: null,
      mobile: null,
      email: null,
      password: null,
      gender: null,
      birthdate: null,
      address1: null,
      address2: null,
      city: null,
      state: null,
      country_id: null,
      postcode: null,
      passwordFieldTypeOld: 'password',
      passwordFieldTypeNew: 'password',
      passwordFieldTypeRetype: 'password',
      loading: false,
      min: minDate,
      max: maxDate,
      email_length: 80,
      first_name_length: 50,
      last_name_length: 50,
      mobile_length: 14,
      address1_length: 100,
      address2_length: 100,
      postcode_length: 10,
      city_length: 50,
      state_length: 50,
      password_length: 16,
      checkEmail: true,
      checkPassword: true,
      checkMobile: true,
      checkPostcode: true,
      isDisabled: false,
      changed: true,
      genders: [
        { id: 1, name: 'Male' },
        { id: 2, name: 'Female' },
      ],
    }
  },
  methods: {
    ...mapActions({
      getSections: 'sections/sections',
      editUser: 'users/edit',
      deleteUser: 'users/remove',
    }),
    fetchOptions(search) {
      const query = { keywords: search }
      this.getSections({ query })
    },
    validatePassword() {
      this.changed = false
      if (
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          this.password,
        )
      ) {
        this.checkPassword = true
      } else if (this.password == '' || this.password == null) {
      } else {
        this.checkPassword = false
      }
    },
    togglePasswordOld() {
      this.passwordFieldTypeOld = this.passwordFieldTypeOld === 'password' ? 'text' : 'password'
    },
    togglePasswordNew() {
      this.passwordFieldTypeNew = this.passwordFieldTypeNew === 'password' ? 'text' : 'password'
    },
    togglePasswordRetype() {
      this.passwordFieldTypeRetype = this.passwordFieldTypeRetype === 'password' ? 'text' : 'password'
    },
    deleteUser() {
      this.$swal({
        title: `${this.$t('Global.deleteTitle')}`,
        text: `${this.$t('Global.deleteText')}`,
        icon: 'warning',
        showCancelButton: true,
cancelButtonText:`${this.$t('Global.cancel')}`,
        confirmButtonText: `${this.$t('Global.deleteBtn')}`,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.deleteUser(this.id).then(_ => {
            this.$router.push({ path: '/users' })
            this.$toast({
              component: ToastificationContent,
              position: 'top-right',
              props: {
                title: 'Success',
                variant: 'success',
                text: `${this.$t('Global.successMessage')}`,
              },
            })
          })
        }
      })
    },
    save() {
      this.$refs.simpleRules
        .validate()
        .then(success => {
          if (success) {
            const payload = {
              first_name: this.first_name,
              last_name: this.last_name,
              email: this.email,
              password: this.password,
              mobile: this.mobile,
              gender: this.gender,
              birthdate: this.birthdate,
              address1: this.address1,
              address2: this.address2,
              postcode: this.postcode,
              city: this.city,
              state: this.state,
              country_id: this.country_id,
            }

            this.editUser({ id: this.id || null, query: payload })
              .then(_ => {
                if (this.$route.params.id) {
                  this.$router.push({
                    name: 'users-view',
                    params: { id: this.$route.params.id },
                  })
                } else {
                  this.$router.push('/users')
                }
                this.$toast({
                  component: ToastificationContent,
                  position: 'top-right',
                  props: {
                    variant: 'success',
                    title: `${this.$t('Global.saved')}`,
                  },
                })
              })
              .catch(error => {
                this.$toast({
                  component: ToastificationContent,
                  position: 'top-right',
                  props: {
                    title: 'Error',
                    variant: 'danger',
                    text: `${error || this.$t('Global.errorMessage')}`,
                  },
                })
              })
          }
        })
        .catch(_ => {})
    },
  },
}
</script>

<style lang="scss">

label,
legend {
  font-weight: bold;
  font-size: 13px;
}
.numberDiv {
  float: right;
  padding: 10px;
  width: 80px;
}
.disabled_all {
  pointer-events: none;
  opacity: 0.2;
  cursor: not-allowed;
}
</style>
