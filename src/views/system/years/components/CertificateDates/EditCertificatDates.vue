<template>
  <div class="new_edit">
    <validation-observer ref="simpleRules">
      <b-overlay
        :show="loading"
        rounded="sm"
      >
      <b-form ref="form" @submit.stop.prevent="save">
        <b-col cols="12">
            <b-card v-if="form">
              <b-card-header :class="'mt-0 pt-0 pb-0 p-0 d-flex justify-content-end'">
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
                <b-row>
                  <b-col md="12">
                    <list
                      style="padding: 0 !important"
                      :data="form"
                      :only="[]"
                      :has-margins="false"
                      class="new_edit"
                    >
                      <template #custom_show>
                        <tr>
                          <th scope="row" :width="'20%'">
                            {{ $t('Global.faculty') }}
                          </th>
                          <td>
                            <div v-if="certificateLookups">
                              <b-form-group
                                class="left_right"
                                label-for="name-input"
                              >
                                <validation-provider
                                  #default="{ errors }"
                                  rules="required"
                                  name="faculty"
                                >
                                <!-- {{certificateLookups.faculties}} -->
                                  <v-select
                                    v-model="form.faculty_id"
                                    :label="getSelectLabel()"
                                    :options="certificateLookups.faculties"
                                    :reduce="(val) => val.id"
                                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                                    :placeholder="$t('Faculty')"
                                  />
                                  <small
                                      class="text-danger"
                                      v-for="(error,index) in errors"
                                      :key="index"
                                  >
                                    {{$i18n.locale == 'ar' ? 'حقل الكلية مطلوب' : error }}
                                  </small>
                                </validation-provider>
                              </b-form-group>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row" :width="'20%'">
                            {{ $t('Global.term') }}
                          </th>
                          <td>
                            <div v-if="certificateLookups">
                              <b-form-group
                                class="left_right"
                                label-for="name-input"
                              >
                                <validation-provider
                                  #default="{ errors }"
                                  rules="required"
                                  name="term"
                                >
                                  <v-select
                                    v-model="form.term_id"
                                    :label="getSelectLabel()"
                                    :options="certificateLookups.terms"
                                    :reduce="(val) => val.id"
                                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                                    :placeholder="$t('Term')"
                                  />
                                  <small
                                      class="text-danger"
                                      v-for="(error,index) in errors"
                                      :key="index"
                                  >
                                    {{$i18n.locale == 'ar' ? 'حقل الفصل الدراسي مطلوب' : error }}
                                  </small>
                                </validation-provider>
                              </b-form-group>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row" :width="'20%'">
                            {{ $t('Global.certificates') }}
                          </th>
                          <td>
                            <div v-if="certificateLookups">
                              <b-form-group
                                class="left_right"
                                label-for="name-input"
                              >
                                <validation-provider
                                  #default="{ errors }"
                                  rules="required"
                                  name="certificates"
                                >
                                  <v-select
                                    v-model="form.certificate_id"
                                    :label="getSelectLabel()"
                                    :options="certificateLookups.certificates"
                                    :reduce="(val) => val.id"
                                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                                    :placeholder="$t('Global.certificates')"
                                  />
                                  <small
                                      class="text-danger"
                                      v-for="(error,index) in errors"
                                      :key="index"
                                  >
                                    {{$i18n.locale == 'ar' ? 'حقل الشهادة مطلوب' : error }}
                                  </small>
                                </validation-provider>
                              </b-form-group>
                            </div>
                          </td>
                        </tr>
                        
                        <tr>
                          <th scope="row" :width="'20%'">
                            {{ $t('Global.UG_date') }}
                          </th>
                          <td>
                            <div v-if="certificateLookups">
                              <b-form-group
                                label-for="UG_date"
                              >
                                <validation-provider
                                  #default="{ errors }"
                                  name="UG_date"
                                  :rules="{
                                    required: true,
                                  }"
                                >
                                  <b-form-datepicker
                                    :label-no-date-selected="$t('Global.no_selected')"
                                    :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                                    id="UG_date"
                                    v-model="form.UG_date"
                                    :state="errors.length > 0 ? false : null"
                                    :placeholder="$t('Global.UG_date')"
                                  />
                                  <small
                                    class="text-danger"
                                    v-for="(error, index) in errors"
                                    :key="index"
                                  >
                                    {{
                                      $i18n.locale == "ar"
                                        ? `حقل ${$t("Global.UG_date")} مطلوب`
                                        : error
                                    }}
                                  </small>
                                </validation-provider>
                              </b-form-group>
                            </div>
                          </td>
                        </tr>

                        <tr>
                          <th scope="row" :width="'20%'">
                            {{ $t('Global.PG_date') }}
                          </th>
                          <td>
                            <div v-if="certificateLookups">
                              <b-form-group
                                label-for="PG_date"
                              >
                                <validation-provider
                                  #default="{ errors }"
                                  name="PG_date"
                                  :rules="{
                                    required: true,
                                  }"
                                >
                                  <b-form-datepicker
                                    :label-no-date-selected="$t('Global.no_selected')"
                                    :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                                    id="PG_date"
                                    v-model="form.PG_date"
                                    :state="errors.length > 0 ? false : null"
                                    :placeholder="$t('Global.PG_date')"
                                  />
                                  <small
                                    class="text-danger"
                                    v-for="(error, index) in errors"
                                    :key="index"
                                  >
                                    {{
                                      $i18n.locale == "ar"
                                        ? `حقل ${$t("Global.PG_date")} مطلوب`
                                        : error
                                    }}
                                  </small>
                                </validation-provider>
                              </b-form-group>
                            </div>
                          </td>
                        </tr> 

                        <!-- <tr>
                          <th scope="row" :width="'20%'">
                            {{ $t('Global.apply_to') }}
                          </th>
                          <td>
                            <div>
                              <b-form-group
                                label-for="apply_to"
                              >
                                <b-form-checkbox
                                  v-model="form.apply_to"
                                />
                              </b-form-group>
                            </div>
                          </td>
                        </tr> -->
                      </template>
                    </list>
                  </b-col>
                </b-row>
              </div>
            </b-card>
        </b-col>

        <b-row>
          <!-- submit and reset -->
          <b-col md="12" style="text-align: end">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              type="submit"
              variant="primary"
              class="mr-1"
              :disabled="saveLoading"
            >
              <b-spinner v-if="saveLoading" small />
              {{ $t("Global.save") }}
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="reset"
              variant="outline-secondary"
              @click="$emit('hideModal')"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </b-form>
      </b-overlay>
    </validation-observer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BForm,
  BButton,
  BOverlay,
  BCard,
  BCardHeader,
  BFormCheckbox,
  BSpinner,
  BFormDatepicker
} from "bootstrap-vue";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { required } from "@validations";
import ShowComponent from "@/views/components/info/show";
import List from "@/views/components/info/list";
import certificate from "@/api/student/certificates/certificate";

export default {
  title: "EditCertificateFees",
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
    BFormDatepicker
  },
  directives: {
    Ripple,
  },
  props: {
    inline: { 
      default: false, 
    },
    data: {
      default: null,
    },
    loading: {
      default: false,
    },
    yearId: {
      default: null,
    },
    customQuery: {
      default: null,
    }
  },
  data() {
    return {
      errorsdata: {},
      saveLoading: false,
      message: null,
      certificateLookups: {},
      form: {
        faculty_id: null,
        term_id: null,
        certificate_id: null,
        UG_date: null,
        PG_date: null,
        // apply_to: false
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      updateCertificatesDates: "certificatesDates/updateCertificatesDates",
      getLookups: "certificatesDates/getLookups",
    }),
    init() {
      this.loading = true
      this.getLookups(this.yearId)
        .then((response) => {
          this.certificateLookups = response;
        }).finally(() => {
            if (this.data) {
              this.form = {
                faculty_id: this.data.faculty ? this.data.faculty.id : null,
                term_id: this.data.term ? this.data.term.id : null,
                certificate_id: this.data.certificate ? this.data.certificate.id : null,
                UG_date: this.data.UG_date ? this.data.UG_date : null,
                PG_date: this.data.PG_date ? this.data.PG_date : null,
                // apply_to: this.data.apply_to ? this.data.apply_to : null,
              };
            }
          this.loading = false
        })
    },
    save() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          this.saveLoading = true
          const payload = {query: this.form}
          payload.id = this.data ? this.data.id : null
          console.log('payload ------------> ' ,  payload);
          this.updateCertificatesDates(payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.$emit("refresh", this.customQuery);
              this.$emit("hideModal");
            })
            .catch((error) => {
              const errors = [error.response.data.errors];
              errors.forEach((error, index) => {
                this.errorsdata = error;
              });
            })
            .finally(() => {
              this.saveLoading = false;
            });
        }
      });
    },
    cancel() {
      if (!this.$route.params.id) {
        this.$router.go(-1);
      } else if (this.inline) {
        return this.$emit("hide");
      }
      return null;
    },
  },
};
</script>

<style lang="scss">
.card-body .tabs {
  overflow: visible !important;
}
</style>
