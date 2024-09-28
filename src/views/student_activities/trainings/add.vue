<template>
  <div>
    <edit-component :name="title">
      <template #inputs>
        <validation-observer ref="simpleRules">
          <b-form ref="form" @submit.stop.prevent="save">
            <b-row>
              <!-- Term -->
              <b-col md="6">
                <b-form-group class="left_right" :label="$t('Global.term')">
                  <validation-provider
                    #default="{ errors }"
                    rules="required"
                    v-if="lookups"
                  >
                    <v-select
                      v-model="form.term_id"
                      :filter="fuseSearch"
                      :label="getSelectLabel()"
                      :options="lookups.terms"
                      :reduce="(val) => val.id"
                      :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'"
                      :placeholder="$t('Global.term')"
                    >
                      <template #no-options>
                        {{ $t("noMatching") }}
                      </template>
                    </v-select>
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'term_id')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- Training types -->
              <b-col md="6">
                <b-form-group class="left_right" :label="$t('Global.type')">
                  <validation-provider
                    #default="{ errors }"
                    rules="required"
                    v-if="lookups"
                  >
                    <v-select
                      v-model="form.training_type_id"
                      :filter="fuseSearch"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="lookups.trainings_types"
                      :label="getSelectLabel()"
                      :reduce="(val) => val.id"
                      :placeholder="$t('Global.type')"
                    >
                      <template v-slot:option="option">
                        {{
                          $i18n.locale == "ar" ? option.name_local : option.name
                        }}
                      </template>
                      <template #selected-option="{ name, name_local }">
                        <div style="display: flex; align-items: baseline">
                          {{ $i18n.locale == "ar" ? name_local : name }}
                        </div>
                      </template>
                      <template #no-options>
                        {{ $t("noMatching") }}
                      </template>
                    </v-select>
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'training_type_id')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- Organization and other organization -->
              <b-col md="6">
                <b-form-group
                  class="left_right"
                  :label="$t('Global.Organization')"
                >
                  <validation-provider
                    #default="{ errors }"
                    rules="required"
                    v-if="lookups"
                  >
                    <v-select
                      v-model="form.organization_id"
                      :filter="fuseSearch"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="lookups.organizations"
                      :label="getSelectLabel()"
                      :reduce="(val) => val.id"
                      :placeholder="$t('Global.Organization')"
                    >
                      <template v-slot:option="option">
                        {{
                          $i18n.locale == "ar" ? option.name_local : option.name
                        }}
                      </template>
                      <template #selected-option="{ name, name_local }">
                        <div style="display: flex; align-items: baseline">
                          {{ $i18n.locale == "ar" ? name_local : name }}
                        </div>
                      </template>
                      <template #no-options>
                        {{ $t("noMatching") }}
                      </template>
                    </v-select>
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'organization_id')
                      "
                    />
                  </validation-provider>
                </b-form-group>
                <!-- other organization -->
                <div v-if="form.organization_id == 0">
                  <validation-provider #default="{ errors }" rules="required">
                    <b-form-input
                      v-model="form.organization_other"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :placeholder="$t('Other')"
                    />
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'organization_other')
                      "
                    />
                  </validation-provider>
                </div>
              </b-col>
              <!-- Title -->
              <b-col md="6">
                <b-form-group class="left_right" :label="$t('Global.title')">
                  <validation-provider #default="{ errors }" rules="required">
                    <b-form-input
                      v-model="form.title"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :placeholder="$t('Global.title')"
                    />
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'title')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- Description -->
              <b-col md="6">
                <b-form-group
                  class="left_right"
                  :label="$t('Global.description')"
                >
                  <validation-provider
                    #default="{ errors }"
                    rules="required"
                    v-if="lookups"
                  >
                    <b-form-textarea
                      v-model="form.description"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :placeholder="$t('Global.excuse_reason')"
                      rows="3"
                      max-rows="6"
                    >
                    </b-form-textarea>
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'description')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- Acceptance Criteria -->
              <b-col md="6">
                <b-form-group
                  class="left_right"
                  :label="$t('Acceptance Criteria')"
                >
                  <validation-provider
                    #default="{ errors }"
                    rules="required"
                    v-if="lookups"
                  >
                    <b-form-textarea
                      v-model="form.acceptance_criteria"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :placeholder="$t('Acceptance Criteria')"
                      rows="3"
                      max-rows="6"
                    >
                    </b-form-textarea>
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'acceptance_criteria')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- Faculties -->
              <b-col md="12">
                <b-form-group class="left_right" :label="$t('faculties')">
                  <validation-provider #default="{ errors }" v-if="lookups">
                    <v-select
                      v-model="form.faculty_ids"
                      :filter="fuseSearch"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="lookups.faculties"
                      :label="getSelectLabel()"
                      :reduce="(val) => val.id"
                      :placeholder="$t('Global.faculty')"
                      multiple
                    >
                      <template v-slot:option="option">
                        <span v-if="$i18n.locale == 'en'">
                          {{ option.name }}
                        </span>
                        <span v-if="$i18n.locale == 'ar'">
                          {{ option.name_local }}
                        </span>
                      </template>
                      <template #selected-option="{ name, name_local }">
                        <span v-if="$i18n.locale == 'en'">
                          {{ name }}
                        </span>
                        <span v-if="$i18n.locale == 'ar'">
                          {{ name_local }}:
                        </span>
                      </template>
                      <template #no-options>
                        {{ $t("noMatching") }}
                      </template>
                    </v-select>
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'faculty_ids')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- Programs -->
              <b-col md="12">
                <b-form-group class="left_right" :label="$t('Global.programs')">
                  <validation-provider #default="{ errors }" v-if="lookups">
                    <v-select
                      v-model="form.program_ids"
                      :filter="fuseSearch"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="programs"
                      :label="getSelectLabel()"
                      :reduce="(val) => val.id"
                      :placeholder="$t('Global.program')"
                      multiple
                    >
                      <template v-slot:option="option">
                        <span v-if="$i18n.locale == 'en'">
                          {{ option.faculty_name }}: {{ option.bylaw_name }}:
                          {{ option.name }}
                        </span>
                        <span v-if="$i18n.locale == 'ar'">
                          {{ option.faculty_name_local }}:
                          {{ option.bylaw_name_local }}:
                          {{ option.name_local }}
                        </span>
                      </template>
                      <template
                        #selected-option="{
                          name,
                          name_local,
                          faculty_name,
                          faculty_name_local,
                          bylaw_name,
                          bylaw_name_local,
                        }"
                      >
                        <span v-if="$i18n.locale == 'en'">
                          {{ faculty_name }}: {{ bylaw_name }}:
                          {{ name }}
                        </span>
                        <span v-if="$i18n.locale == 'ar'">
                          {{ faculty_name_local }}: {{ bylaw_name_local }}:
                          {{ name_local }}:
                        </span>
                      </template>
                      <template #no-options>
                        {{ $t("noMatching") }}
                      </template>
                    </v-select>
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'program_ids')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- number of weeks -->
              <b-col md="6">
                <b-form-group class="left_right" :label="$t('number of weeks')">
                  <validation-provider #default="{ errors }" rules="required">
                    <b-form-input
                      v-model="form.num_of_weeks"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :placeholder="$t('number of weeks')"
                      type="number"
                    />
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'num_of_weeks')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- number of students -->
              <b-col md="6">
                <b-form-group
                  class="left_right"
                  :label="$t('number of students')"
                >
                  <validation-provider #default="{ errors }" rules="required">
                    <b-form-input
                      v-model="form.num_of_students"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :placeholder="$t('number of students')"
                      type="number"
                    />
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'num_of_students')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- Admission Start Date -->
              <b-col md="6">
                <b-form-group
                  class="left_right"
                  :label="$t('Global.admission_start_at')"
                >
                  <validation-provider #default="{ errors }" rules="required">
                    <b-form-datepicker
                    
                      v-model="form.admission_start_at"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :placeholder="$t('Global.admission_start_at')"
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      :class="$i18n.locale == 'ar' ? 'cal' : 'en'"
                      
                    />
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'admission_start_at')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- Admission end Date -->
              <b-col md="6">
                <b-form-group
                  class="left_right"
                  :label="$t('Global.admission_end_at')"
                >
                  <validation-provider #default="{ errors }" rules="required">
                    <b-form-datepicker
                      v-model="form.admission_end_at"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :placeholder="$t('Global.admission_end_at')"
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      :state="errors.length > 0 ? false : null"
                      :class="$i18n.locale == 'ar' ? 'cal' : 'en'"
                    />
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'admission_end_at')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- Start Date -->
              <b-col md="6">
                <b-form-group
                  class="left_right"
                  :label="$t('Global.start_date')"
                >
                  <validation-provider #default="{ errors }" rules="required">
                    <b-form-datepicker
                      v-model="form.start_at"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :placeholder="$t('Global.start_date')"
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      :class="$i18n.locale == 'ar' ? 'cal' : 'en'"
                    />
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'start_at')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- end Date -->
              <b-col md="6">
                <b-form-group class="left_right" :label="$t('Global.end_date')">
                  <validation-provider #default="{ errors }" rules="required">
                    <b-form-datepicker
                      v-model="form.end_at"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :placeholder="$t('Global.end_date')"
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      :class="$i18n.locale == 'ar' ? 'cal' : 'en'"
                    />
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'end_at')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- Training Overview Document -->
              <b-col md="6">
                <b-form-group
                  class="left_right"
                  :label="$t('Training Overview Document')"
                >
                  <validation-provider #default="{ errors }">
                    <b-form-file
                      accept=".jpg, .jpeg, .png, .pdf"
                      v-model="form.file"
                      :placeholder="$t('Global.upload_file')"
                      :drop-placeholder="$t('Global.upload_file')"
                    />
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="errors"
                      :backend-errors="getBackendFieldError(errorsdata, 'file')"
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- CV, Interview, free of charge -->
              <b-col md="6">
                <b-row>
                  <!-- CV -->
                  <b-col md="4">
                    <b-form-group
                      class="left_right"
                      :label="$t('CV is required')"
                    >
                      <b-form-checkbox
                        v-model="form.cv_required"
                        value="1"
                        style="margin-top: 6px"
                        class="mt-0 custom-control-primary"
                      />
                    </b-form-group>
                  </b-col>
                  <!-- interview -->
                  <b-col md="4">
                    <b-form-group
                      class="left_right"
                      :label="$t('Interview is required')"
                    >
                      <b-form-checkbox
                        v-model="form.interview_required"
                        value="1"
                        style="margin-top: 6px"
                        class="mt-0 custom-control-primary"
                      />
                    </b-form-group>
                  </b-col>
                  <!-- free of charge -->
                  <b-col md="4">
                    <b-form-group
                      class="left_right"
                      :label="$t('Free of charge')"
                    >
                      <b-form-checkbox
                        v-model="form.free_of_charge"
                        value="1"
                        style="margin-top: 6px"
                        class="mt-0 custom-control-primary"
                      />
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-col>
              <!-- submit and reset -->
              <b-col md="12 mt-3">
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  type="submit"
                  variant="primary"
                  :class="load ? 'disabled_all mr-1' : 'mr-1'"
                >
                  <span v-if="!load"> {{ $t("Global.save") }}</span>
                  <b-spinner
                    v-if="load"
                    small
                    :label="$t('Global.loading')"
                  ></b-spinner>
                </b-button>

                <b-button
                  v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                  type="reset"
                  variant="outline-secondary"
                  :to="{ name: 'trainings' }"
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
  BCard,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BForm,
  BButton,
  BFormFile,
  BFormTextarea,
  BSpinner,
  BPopover,
  BFormDatepicker,
} from "bootstrap-vue";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { required, email } from "@validations";
import EditComponent from "@/views/components/table/Edit";
import lookups from "@/api/system/lookups";
import request from '@/utils/request';
export default {
  name: "Edit",
  components: {
    EditComponent,
    ValidationErrors,
    vSelect,
    BCard,
    BCol,
    BRow,
    BFormGroup,
    BFormInput,
    BFormFile,
    BFormCheckbox,
    BForm,
    BButton,
    ValidationProvider,
    ValidationObserver,
    localize,
    BFormTextarea,
    BSpinner,
    BPopover,
    BFormDatepicker,
  },
  computed: {
    ...mapGetters({
      lookups: "trainings/lookups",
      load: "trainings/load",
    }),
    title() {
      return this.$t("Add Training");
    },
  },

  directives: {
    Ripple,
  },
  data() {
    return {
      form: {
        term_id: null,
        training_type_id: null,
        organization_id: null,
        organization_other: null,
        description: null,
        acceptance_criteria: null,
        faculty_ids: [],
        program_ids: [],
        num_of_weeks: null,
        admission_start_at: null,
        admission_end_at: null,
        start_at: null,
        end_at: null,
        cv_required: null,
        interview_required: null,
        free_of_charge: null,
        file: null,
      },
      programs: [],
      errorsdata: {},
      terms : []
    };
  },
  mounted() {
    this.init();
   // this.getTerms()
  },
  watch: {
    "form.faculty_ids": function (val) {
      this.programs = [];
      this.lookups.programs.filter((item) => {
        if (val.includes(item.faculty_id)) {
          this.programs.push(item);
        }
      });
    },
  },
  methods: {
    ...mapActions({
      getLookups: "trainings/lookups",
    }),

    init() {
      this.getLookups();
    },
     getTerms() {
      
        request.get(`trainings/selectTerms`).then((res) => {
          
            this.terms = res.data
          
        }).catch(err => {
        })
      
    },
    save() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          const formData = new FormData();

          if (this.form.term_id) formData.append("term_id", this.form.term_id);

          if (this.form.training_type_id)
            formData.append("training_type_id", this.form.training_type_id);

          if (this.form.organization_id != null)
            formData.append("organization_id", this.form.organization_id);

          if (this.form.organization_other && this.form.organization_id == 0)
            formData.append("organization_other", this.form.organization_other);

          if (this.form.title) formData.append("title", this.form.title);

          if (this.form.description)
            formData.append("description", this.form.description);

          if (this.form.acceptance_criteria)
            formData.append(
              "acceptance_criteria",
              this.form.acceptance_criteria
            );

          if (this.form.faculty_ids)
            this.form.faculty_ids.forEach(function (value) {
              formData.append("faculty_ids[]", value);
            });

          if (this.form.program_ids)
            this.form.program_ids.forEach(function (value) {
              formData.append("program_ids[]", value);
            });

          if (this.form.num_of_students)
            formData.append("num_of_students", this.form.num_of_students);

          if (this.form.num_of_weeks)
            formData.append("num_of_weeks", this.form.num_of_weeks);

          if (this.form.admission_start_at)
            formData.append("admission_start_at", this.form.admission_start_at);

          if (this.form.admission_end_at)
            formData.append("admission_end_at", this.form.admission_end_at);

          if (this.form.start_at)
            formData.append("start_at", this.form.start_at);

          if (this.form.end_at) formData.append("end_at", this.form.end_at);

          if (this.form.cv_required)
            formData.append("cv_required", this.form.cv_required);

          if (this.form.interview_required)
            formData.append("interview_required", this.form.interview_required);

          if (this.form.free_of_charge)
            formData.append("free_of_charge", this.form.free_of_charge);

          if (this.form.file) formData.append("file", this.form.file);

          formData.append("_method", "PUT");

          const payload = { id: null, query: formData };
          this.$store
            .dispatch("trainings/put", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                text: `${this.$t("Global.successMessage")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.$router.push({ name: "trainings" });
            })
            .catch((error) => {
              const errors = [error.response.data.errors];
              errors.forEach((error) => {
                this.errorsdata = error;
              });
            });
        }
      });
    },
  },
};
</script>
<style >
/* [dir=rtl] .dropdown-menu {
    right: 100%;
    float: right;
    text-align: right;
} */
 .cal  .dropdown-menu{
  transform: translate3d(-100%, -338px, 0px) !important;
  width: fit-content;
}

</style>