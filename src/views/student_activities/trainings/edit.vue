<template>
  <div>
    <div class="new_edit">
      <validation-observer ref="simpleRules">
        <b-form ref="form" @submit.stop.prevent="save">
          <ShowComponent
            :loading="load"
            :data="item"
            :only="[
              'title',
              'trainingType',
              'term',
              'organization',
              'description',
              'acceptance_criteria',
              'faculties',
              'programs',
              'num_of_weeks',
              'admission_start_at',
              'admission_end_at',
              'start_at',
              'end_at',
              'cv_required',
              'interview_required',
              'free_of_charge',
              'documents',
            ]"
          >
            <!-- Title -->
            <template #title>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.title`) }}
              </th>
              <td>
                <b-form-group class="left_right">
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
              </td>
            </template>
            <!-- training Type -->
            <template #trainingType>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.type`) }}
              </th>
              <td>
                <b-form-group class="left_right">
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
              </td>
            </template>
            <!-- Semester -->
            <template #term>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.term`) }}
              </th>
              <td>
                <b-form-group class="left_right">
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
              </td>
            </template>
            <!-- Organization -->
            <template #organization>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.Organization`) }}
              </th>
              <td>
                <b-form-group class="left_right">
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
                      :default-messauge="true"
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'organization_id')
                      "
                    />
                  </validation-provider>
                </b-form-group>
                <!-- other organization -->
                <b-form-group
                  class="left_right"
                  v-if="
                    form.organization_id == 'other' ||
                    form.organization_id == 0 ||
                    form.organization_id == null
                  "
                  style="padding-top: 5px"
                >
                  <validation-provider #default="{ errors }">
                    <b-form-input
                      v-model="form.organization_other"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :placeholder="$t('Global.Other')"
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
              </td>
            </template>
            <!-- Description -->
            <template #description>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.description`) }}
              </th>
              <td>
                <b-form-group class="left_right">
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
              </td>
            </template>
            <!-- Acceptance Criteria -->
            <template #acceptance_criteria>
              <th scope="row" :width="'20%'">
                {{ $t(`Acceptance Criteria`) }}
              </th>
              <td>
                <b-form-group class="left_right">
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
              </td>
            </template>
            <!-- Faculties -->
            <template #faculties>
              <th scope="row" :width="'20%'">
                {{ $t(`faculties`) }}
              </th>
              <td>
                <b-form-group class="left_right">
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
                          {{ option.name_local }}:
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
              </td>
            </template>
            <!-- programs -->
            <template #programs>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.programs`) }}
              </th>
              <td>
                <b-form-group class="left_right">
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
                          {{ option.name_local }}:
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
              </td>
            </template>
            <!-- number of weeks -->
            <template #num_of_weeks>
              <th scope="row" :width="'20%'">
                {{ $t(`number of weeks`) }}
              </th>
              <td>
                <b-form-group class="left_right">
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
              </td>
            </template>
            <!-- Admission Start Date  -->
            <template #admission_start_at>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.admission_start_at`) }}
              </th>
              <td>
                <b-form-group class="left_right">
                  <validation-provider #default="{ errors }" rules="required">
                    <b-form-datepicker
                      v-model="form.admission_start_at"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :placeholder="$t('Global.admission_start_at')"
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
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
              </td>
            </template>
            <!-- Admission End Date  -->
            <template #admission_end_at>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.admission_end_at`) }}
              </th>
              <td>
                <b-form-group class="left_right">
                  <validation-provider #default="{ errors }" rules="required">
                    <b-form-datepicker
                      v-model="form.admission_end_at"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :placeholder="$t('Global.admission_end_at')"
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      :state="errors.length > 0 ? false : null"
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
              </td>
            </template>
            <!-- start_at -->
            <template #start_at>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.start_date`) }}
              </th>
              <td>
                <b-form-group class="left_right">
                  <validation-provider #default="{ errors }" rules="required">
                    <b-form-datepicker
                      v-model="form.start_at"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :placeholder="$t('Global.start_date')"
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
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
              </td>
            </template>
            <!-- end_at -->
            <template #end_at>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.end_date`) }}
              </th>
              <td>
                <b-form-group class="left_right">
                  <validation-provider #default="{ errors }" rules="required">
                    <b-form-datepicker
                      v-model="form.end_at"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :placeholder="$t('Global.end_date')"
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
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
              </td>
            </template>
            <!-- CV is required -->
            <template #cv_required>
              <th scope="row" :width="'20%'">
                {{ $t(`CV is required`) }}
              </th>
              <td>
                <b-form-group class="left_right">
                  <b-form-checkbox
                    v-model="form.cv_required"
                    value="1"
                    style="margin-top: 6px"
                    class="mt-0 custom-control-primary"
                  />
                </b-form-group>
              </td>
            </template>
            <!-- Interview is required -->
            <template #interview_required>
              <th scope="row" :width="'20%'">
                {{ $t(`Interview is required`) }}
              </th>
              <td>
                <b-form-group class="left_right">
                  <b-form-checkbox
                    v-model="form.interview_required"
                    value="1"
                    style="margin-top: 6px"
                    class="mt-0 custom-control-primary"
                  />
                </b-form-group>
              </td>
            </template>
            <!-- Free of charge -->
            <template #free_of_charge>
              <th scope="row" :width="'20%'">
                {{ $t(`Free of charge`) }}
              </th>
              <td>
                <b-form-group class="left_right">
                  <b-form-checkbox
                    v-model="form.free_of_charge"
                    value="1"
                    style="margin-top: 6px"
                    class="mt-0 custom-control-primary"
                  />
                </b-form-group>
              </td>
            </template>
            <!-- Training Overview Document -->
            <template #documents>
              <th scope="row" :width="'20%'">
                {{ $t(`Training Overview Document`) }}
              </th>
              <td>
                <b-form-group class="left_right">
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
              </td>
            </template>
            <!-- Edit icon -->
            <template #edit>
              <div class="mt-0 mb-1">
                <feather-icon
                  v-if="hasPermission('edit_training')"
                  @click="cancel()"
                  style="cursor: pointer"
                  icon="XCircleIcon"
                  class="font-medium-3"
                  v-b-tooltip.hover="$t('Global.close')"
                />
              </div>
            </template>
          </ShowComponent>
          <b-row>
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
                @click="cancel"
              >
                {{ $t("Global.cancel") }}
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
    </div>
  </div>
</template>

<script>
import ValidationErrors from "@/views/components/common/ValidationErrors";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import {
  extend,
  ValidationProvider,
  ValidationObserver,
  localize,
} from "vee-validate";
import { mapGetters, mapActions } from "vuex";
import { required } from "@validations";
import { PlusIcon } from "vue-feather-icons";
import ShowComponent from "@/views/components/info/show";
import {
  BFormFile,
  BCard,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BForm,
  BButton,
  BFormTextarea,
  BSpinner,
  BPopover,
  BFormDatepicker,
  BFormCheckbox,
  BBadge,
} from "bootstrap-vue";

export default {
  name: "edit",
  components: {
    ShowComponent,
    vSelect,
    ValidationErrors,
    BFormFile,
    required,
    extend,
    PlusIcon,
    ValidationProvider,
    ValidationObserver,
    BForm,
    BFormGroup,
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BFormTextarea,
    BSpinner,
    BPopover,
    localize,
    BFormDatepicker,
    BFormCheckbox,
    BBadge,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      programs: [],
      errorsdata: {},
    };
  },
  computed: {
    ...mapGetters({
      lookups: "trainings/lookups",
      item: "trainings/item",
      load: "trainings/load",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
  },
  props: {
    inline: { default: false, Type: Boolean },
    tabNumber: Number,
    form: { default: {}, type: [Array, Object] },
  },
  methods: {
    ...mapActions({
      getLookups: "trainings/lookups",
    }),
    cancel() {
      if (!this.id) {
        this.$router.go(-1);
      }
      if (this.inline) {
        return this.$emit("hide");
      }
    },
    save() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          const formData = new FormData();

          formData.append("term_id", this.form.term_id);
          formData.append("training_type_id", this.form.training_type_id);
          formData.append("organization_id", this.form.organization_id);

          if (this.form.organization_other && this.form.organization_id == 0)
            formData.append("organization_other", this.form.organization_other);

          formData.append("title", this.form.title);
          formData.append("description", this.form.description);
          formData.append("acceptance_criteria", this.form.acceptance_criteria);

          if (this.form.faculty_ids)
            this.form.faculty_ids.forEach(function (value) {
              formData.append("faculty_ids[]", value);
            });

          if (this.form.program_ids)
            this.form.program_ids.forEach(function (value) {
              formData.append("program_ids[]", value);
            });

          formData.append("num_of_students", this.form.num_of_students);
          formData.append("num_of_weeks", this.form.num_of_weeks);
          formData.append("admission_start_at", this.form.admission_start_at);
          formData.append("admission_end_at", this.form.admission_end_at);
          formData.append("start_at", this.form.start_at);
          formData.append("end_at", this.form.end_at);
          formData.append("cv_required", this.form.cv_required);
          formData.append("interview_required", this.form.interview_required);
          formData.append("free_of_charge", this.form.free_of_charge);

          if (this.form.file) formData.append("file", this.form.file);

          formData.append("_method", "PUT");

          const payload = { id: this.id, query: formData };

          this.$store
            .dispatch("trainings/put", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              if (this.inline) {
                this.$emit("refresh");
                return this.$emit("hide");
              }
              this.$router.push({ name: "Training" });
            })
            .catch((error) => {
              const errors = [error.response.data.errors];
              errors.forEach((error, index) => {
                const error_data = Object.values(error)[index][0];
                this.errorsdata = error;
              });
            });
        }
      });
    },
    //filter the programs based on the selected faculties
    filterPrograms(faculty_ids = null) {
      faculty_ids = faculty_ids ?? this.form.faculty_ids;
      this.programs = [];
      this.lookups.programs.filter((item) => {
        if (faculty_ids.includes(item.faculty_id)) {
          this.programs.push(item);
        }
      });
    },
  },
  mounted() {
    this.getLookups().then(() => {
      this.filterPrograms();
    });
  },
  watch: {
    "form.faculty_ids": function (newVal) {
      this.filterPrograms(newVal);
    },
  },
};
</script>
