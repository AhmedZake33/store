<template>
  <div>
    <edit-component :name="title">
      <template #inputs>
        <validation-observer ref="simpleRules">
          <b-form ref="form" @submit.stop.prevent="save">
            <div
              v-if="load"
              style="
                position: absolute;
                width: 100%;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: #fff;
                opacity: 0.8;
                text-align: center;
                z-index: 999;
              "
            >
              <b-spinner
                variant="primary"
                style="position: absolute; top: 70px; z-index: 1000"
              />
            </div>
            <b-row v-else>
              <!-- student -->
              <b-col md="6">
                <b-form-group
                  :label="$t('Global.english_name')"
                  label-for="name-input"
                >
                  <b-form-input
                    v-if="student"
                    id="name-input"
                    :value="
                      $i18n.locale == 'ar' ? student.name : student.name_local
                    "
                    :disabled="true"
                  >
                  </b-form-input>
                </b-form-group>
              </b-col>

              <!-- Excuse Type -->
              <b-col md="6">
                <b-form-group
                  class="left_right"
                  :label="$t('Global.excuse_type')"
                >
                  <validation-provider
                    #default="{ errors }"
                    rules="required"
                    v-if="lookups"
                  >
                    <v-select
                      v-model="form.excuse_type"
                      :filter="fuseSearch"
                      :label="getSelectLabel()"
                      :options="lookups.types"
                      :reduce="(val) => val.id"
                      :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'"
                    >
                      <template #no-options>
                        {{ $t("noMatching") }}
                      </template>
                    </v-select>
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'excuse_type')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>

              <!-- Year -->
              <b-col md="6">
                <b-form-group class="left_right" :label="$t('Global.year')">
                  <validation-provider
                    #default="{ errors }"
                    name="year_id"
                    :rules="yearsFlag == false ? 'required' : ''"
                    v-if="lookups"
                  >
                    <v-select
                      v-if="lookups"
                      v-model="form.year_id"
                      :filter="fuseSearch"
                      :label="$i18n.locale == 'en' ? 'year' : 'year'"
                      :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'"
                      :options="lookups.years"
                      :reduce="(val) => val.id"
                      :disabled="yearsFlag"
                    >
                      <template v-slot:option="option">
                        {{ option.start_year + "/" + option.end_year }}
                      </template>
                      <template #selected-option="{ start_year, end_year }">
                        {{ start_year + "/" + end_year }}
                      </template>
                      <template #no-options>
                        {{ $t("noMatching") }}
                      </template>
                    </v-select>
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="yearsFlag ? null : errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'year_id')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>

              <!-- Terms  -->
              <b-col md="6">
                <b-form-group
                  class="left_right"
                  :label="$t('Global.term')"
                  label-for="name-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="term"
                    :rules="termsFlag == false ? 'required' : ''"
                    v-if="lookups"
                  >
                    <v-select
                      v-model="form.term"
                      :filter="fuseSearch"
                      :label="getSelectLabel()"
                      :options="lookups.terms"
                      :disabled="termsFlag"
                      :reduce="(val) => val.id"
                      :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'"
                    >
                      <template v-slot:option="option">
                        {{
                          $i18n.locale == "ar" ? option.name_local : option.name
                        }}
                      </template>
                      <template #selected-option="{ name, name_local }">
                        {{ $i18n.locale == "ar" ? name_local : name }}
                      </template>
                      <template #no-options>
                        {{ $t("noMatching") }}
                      </template>
                    </v-select>
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="termsFlag ? null : errors"
                      :backend-errors="getBackendFieldError(errorsdata, 'term')"
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>

              <!-- Courses -->
              <b-col md="6">
                <b-form-group
                  class="left_right"
                  :label="$t('Global.offerings')"
                >
                  <validation-provider
                    #default="{ errors }"
                    :rules="offeringsFlag == false ? 'required' : ''"
                    v-if="lookups"
                  >
                    <v-select
                      v-model="form.offerings"
                      :filter="fuseSearch"
                      :label="getSelectLabel()"
                      :options="lookups.offerings"
                      :disabled="offeringsFlag"
                      :reduce="(val) => val.id"
                      :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'"
                      multiple
                    >
                      <template v-slot:option="option">
                        {{
                          $i18n.locale == "ar"
                            ? option.code + " " + option.name_local
                            : option.code + " " + option.name
                        }}
                      </template>
                      <template #selected-option="{ code, name, name_local }">
                        <div style="display: flex; align-items: baseline">
                          {{
                            $i18n.locale == "ar"
                              ? code + " " + name_local
                              : code + " " + name
                          }}
                        </div>
                      </template>
                      <template #no-options>
                        {{ $t("noMatching") }}
                      </template>
                    </v-select>
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="offeringsFlag ? false : errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'offerings')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>

              <!-- Files -->
              <b-col md="6">
                <b-form-group
                  class="left_right"
                  :label="$t('Global.supported_document')"
                >
                  <validation-provider
                    #default="{ errors }"
                    v-if="lookups"
                  >
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

              <!-- Excuse Reason -->
              <b-col md="6">
                <b-form-group
                  class="left_right"
                  :label="$t('Global.excuse_reason')"
                >
                  <validation-provider
                    #default="{ errors }"
                    rules="required"
                    v-if="lookups"
                  >
                    <b-form-textarea
                      id="excuse_reason"
                      v-model="form.reason"
                      :placeholder="$t('Global.excuse_reason')"
                      rows="3"
                      max-rows="6"
                    >
                    </b-form-textarea>
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'reason')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>

              <!-- submit and reset -->
              <b-col md="12 mt-3">
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
} from "bootstrap-vue";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import EditComponent from "@/views/components/table/Edit";
import { required } from "@validations";

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
    required,
  },
  data() {
    return {
      form: {
        excuse_type: null,
        term: null,
        offerings: [],
        file: null,
        reason: null,
        year_id: null,
      },
      student: null,
      errorsdata: {},
      yearsFlag: false,
      termsFlag: false,
      offeringsFlag: false,
    };
  },
  computed: {
    ...mapGetters({
      lookups: "excuses/lookups",
      item: "excuses/item",
      load: "excuses/load",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    title() {
      return this.id
        ? this.$t("Global.excuse_edit")
        : this.$t("Global.excuse_add");
    },
  },
  watch: {
    "form.excuse_type"(newVal, oldVal) {
      if (newVal == 1) {
        //Type: Year
        this.yearsFlag = false;
        this.termsFlag = true;
        this.offeringsFlag = true;
        this.form.term = null;
        this.form.offerings = null;
      } else if (newVal == 2) {
        //Type: Term
        this.yearsFlag = true;
        this.termsFlag = false;
        this.offeringsFlag = true;
        this.form.year_id = null;
        this.form.offerings = null;
      } else if (newVal == 3) {
        //Type: offering
        this.yearsFlag = true;
        this.termsFlag = true;
        this.offeringsFlag = false;
        this.form.year_id = null;
        this.form.term = null;
      }
    },
  },
  directives: {
    Ripple,
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      getItem: "excuses/get",
    }),

    init() {
      // this.$store.dispatch("excuses/lookups", { student_id: this.student.id });
      if (this.id) {
        this.getItem(this.id).then((_) => {
          this.student = this.item.user;
          this.form.excuse_type = this.item.excuse_type.id;
          this.form.term = this.item.term ? this.item.term : null;
          this.form.file = this.item.file;
          this.form.year_id = this.item.year ? this.item.year.id : null;
          this.form.user_id = this.item.user.id;
          this.form.reason = this.item.reason;
          this.item.offerings.forEach((element) => {
            this.form.offerings.push(element.id);
          });
        });
      }
    },

    save() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          const formData = new FormData();

          if (this.form.offerings)
            this.form.offerings.forEach(function (value) {
              formData.append("offerings[]", value);
            });

          formData.append("excuse_type_id", this.form.excuse_type);

          this.form.term == null
            ? formData.delete("term_id")
            : formData.append("term_id", this.form.term);
          formData.append("_method", "PUT");
          for (const [key, value] of Object.entries(this.form)) {
            if (value) {
              formData.append(key, value);
            }
          }
          if (this.yearsFlag == true) {
            formData.delete("year_id");
          }
          if (this.termsFlag == true) {
            formData.delete("term_id");
          }
          if (this.offeringsFlag == true) {
            formData.delete("offerings[]");
          }
          formData.delete("excuse_type");
          formData.delete("offerings");
          formData.delete("term");

          const payload = { id: this.id, query: formData };
          this.$store
            .dispatch("excuses/put", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.$router.push({ name: "excuses" });
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

    cancel() {
      this.$router.push({ name: "excuses" });
    },

    onFileSelected(event) {
      this.form.file = event.target.files[0];
    },
  },
};
</script>

<style></style>
