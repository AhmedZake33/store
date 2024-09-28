<template>
    <div>
      <edit-component :name="title">
        <template #inputs>
          <validation-observer ref="simpleRules">
            <b-form ref="form" @submit.stop.prevent="save">
              <b-row v-if="form">
                <b-col md="6">
                  <b-form-group
                    class="left_right"
                    :label="$t('Global.bank')"
                    label-for="bank-input"
                  >
                    <validation-provider
                      #default="{ errors }"
                      rules="required"
                    >
                    <v-select v-model="form.bank_name_id" 
                              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" 
                              :options="options.banks_names" class="w-100 mb-2" 
                              :reduce="val => val.id" 
                              :placeholder="$t('Global.Bank')"
                              :filter="fuseSearch">
                    <template slot="selected-option" slot-scope="option">
                      <span v-if="$i18n.locale == 'ar'">
                        {{ option.name_local || option.name }}
                      </span>
                      <span v-else>
                        {{ option.name || option.name_local }}
                      </span>
                    </template>
                    <template v-slot:option="option">
                      {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                    </template>
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                      <ValidationErrors
                        :frontend-errors="errors"
                        :backend-errors="getBackendFieldError(errorsdata, 'bank_name_id')"
                      />
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group
                    class="left_right"
                    :label="$t('Global.currency')"
                    label-for="name-input"
                  >
                    <validation-provider
                      #default="{ errors }"
                      rules="required"
                    >
                    <v-select v-model="form.currency_id" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="options.currencies" class="w-100 mb-2" :reduce="val => val.id" :placeholder="$t('Global.currency')" :filter="fuseSearch">
                    <template slot="selected-option" slot-scope="option">
                      <span v-if="$i18n.locale == 'ar'">
                        {{ option.name_local || option.name }}
                      </span>
                      <span v-else>
                        {{ option.name || option.name_local }}
                      </span>
                    </template>
                    <template v-slot:option="option">
                      {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                    </template>
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                      <ValidationErrors
                        :frontend-errors="errors"
                        :backend-errors="getBackendFieldError(errorsdata, 'currency_id')"
                      />
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group
                    class="left_right"
                    :label="$t('Global.account_number')"
                    label-for="account-input"
                  >
                    <validation-provider
                      #default="{ errors }"

                      rules="required|number"
                    >
                      <b-form-input
                        id="name-input"
                        v-model="form.account_number"
                        :state="errors.length > 0 ? false : null"
                      />
                      <ValidationErrors
                        :frontend-errors="errors"
                        :backend-errors="getBackendFieldError(errorsdata, 'account_number')"
                      />
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group
                    :state="nameLocalState"
                    :label="$t('Global.iban')"
                    label-for="iban-input"
                  >
                    <validation-provider
                      #default="{ errors }"
                    >
                      <b-form-input
                        id="iban-input"
                        class="left_right"
                        v-model="form.iban"
                        :state="errors.length > 0 ? false : null"
                      />
                      <ValidationErrors
                        :frontend-errors="errors"
                        :backend-errors="
                          getBackendFieldError(errorsdata, 'iban')
                        "
                      />
                    </validation-provider>
                  </b-form-group>
                </b-col>
                
  
                <!-- submit and reset -->
                <b-col md="12">
                  <b-button
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    type="submit"
                    variant="primary"
                    class="mr-1"
                  >
                    {{ $t("Global.save") }}
                  </b-button>
                  <b-button
                    v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                    type="reset"
                    variant="outline-secondary"
                    @click="cancel"
                  >
                    {{ $t("Global.cancel") }}
                  </b-button>
                </b-col>
              </b-row>
            </b-form>
          </validation-observer>
        </template>
      </edit-component>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from "vuex";
  import {
    BRow,
    BCol,
    BForm,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BButton,
  } from "bootstrap-vue";
  import Ripple from "vue-ripple-directive";
  import vSelect from 'vue-select';
  import ValidationErrors from "@/views/components/common/ValidationErrors";
  import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
  import { required } from "@validations";
  import EditComponent from "@/views/components/table/Edit";
  
  export default {
    title: "Edit",
    components: {
      vSelect,
      BRow,
      BCol,
      BFormGroup,
      BFormInput,
      BFormCheckbox,
      BForm,
      BButton,
      EditComponent,
      ValidationErrors,
      ValidationProvider,
      ValidationObserver,
      localize,
    },
    directives: {
      Ripple,
    },
  
    computed: {
      ...mapGetters({
        item: "bankInfos/item",
        load: "bankInfos/load",
        options: 'app/lookups',
      }),
      id() {
        return this.$route.params.id ? this.$route.params.id : null;
      },
      title() {
        return this.id
          ? this.$t("Global.Edit Bank Information")
          : this.$t("Global.Add Bank Information");
      },
    },
    data() {
      return {
        nameLocalState: null,
        form: {
            account_number: null,
            iban: null,
            bank_name_id :null,
            currency_id :null,
        },
        errorsdata: {},
      };
    },
    mounted() {
      this.init();
    },
  
    methods: {
      ...mapActions({
        getItem: "bankInfos/get",
        getLookups: 'app/GET_LOOKUPS',
      }),
      init() {
        if (this.id) {
          this.getItem(this.id).then((data) => {
            console.log(data.data);
            this.form.account_number = data.data.account_number;
            this.form.iban = data.data.iban;
            this.form.bank_name_id = data.data.bank.id;
            this.form.currency_id = data.data.currency.id;
          });
        }
        this.getLookups({ banks_names: true,currencies:true }).then(data => {

        });
      },
  
      save() {
        this.$refs.simpleRules.validate().then((success) => {
          if (success) {
            const payload = { id: this.id, query: this.form };
            this.$store
              .dispatch("bankInfos/put", payload)
              .then((response) => {
                this.$swal({
                  icon: "success",
                  text: `${this.$t("Global.successMessage")}`,
                  showConfirmButton: false,
                  timer: 1500,
                });
                if (this.inline) {
                  this.$emit("refresh");
                  return this.$emit("hide");
                }
                this.$router.push({
                  name: "bank_settings",
                  query: { tabNum: 2 },
                });
              })
              .catch((error) => {
                this.$swal({
                  icon: "error",
                  text: `${error || this.$t("Global.errorMessage")}`,
                  showConfirmButton: false,
                  timer: 1500,
                });
                const errors = [error.response.data.errors];
                errors.forEach((error, index) => {
                  const error_data = Object.values(error)[index][0];
                  this.errorsdata = error;
                });
              });
          }
        });
      },
  
      cancel() {
        this.$router.push({
                  name: "bank_settings",
                  query: { tabNum: 2 },
                });
      },
    },
  };
  </script>
  
  <style lang="scss"></style>
  