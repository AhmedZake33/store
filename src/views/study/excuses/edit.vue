<template>
  <div>
    <div class="new_edit">
      <validation-observer ref="simpleRules">
        <b-form ref="form" @submit.stop.prevent="save">
          <b-overlay :show="load" rounded="sm">
            <ShowComponent
              :loading="load"
              :data="item"
              :only="[
                'excuse_type',
                'offerings',
                'term',
                'year',
                'reason',
              ]"
            >
              <template #excuse_type>
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.excuse_type`) }}
                </th>
                <td>
                  <b-form-group class="left_right" label-for="name-input">
                    <validation-provider
                      #default="{ errors }"
                      rules="required"
                      name="type"

                    >
                      <v-select
                        v-model="form.excuse_type"
                        :label="getSelectLabel()"
                        :options="lookups.types"
                        :reduce="(val) => val.id"
                        :class="errors.length > 0 ? 'custom_invalid' : ''"
                        :placeholder="$t('type')"
                      />
                      <small
                        class="text-danger"
                        v-for="(error, index) in errors"
                        :key="index"
                      >
                        {{ $i18n.locale == "ar" ? "حقل النوع مطلوب" : error }}
                      </small>
                    </validation-provider>
                  </b-form-group>
                </td>
              </template>
              <template #offerings>
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.offerings`) }}
                </th>
                <td>
                  <b-form-group
                    class="left_right"
                  >
                    <validation-provider
                      #default="{ errors }"
                      :rules="offeringsFlag == false ? 'required' : ''"

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
                </td>
              </template>
              <template #term>
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.term`) }}
                </th>
                <td>
                  <b-form-group
                    class="left_right"
                    label-for="name-input"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="term"
                      :rules="termsFlag == false ? 'required' : ''"

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
                </td>
              </template>
              <template #year>
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.academic_year`) }}
                </th>
                <td>
                  <b-form-group class="left_right">
                    <validation-provider
                      #default="{ errors }"
                      name="year_id"
                      :rules="yearsFlag == false ? 'required' : ''"

                    >
                      <v-select
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
                </td>
              </template>
              <!-- <template #file>
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.file`) }}
                </th>
                <td>
                  <b-form-group
                    class="left_right"
                  >
                    <validation-provider
                      #default="{ errors }"

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
                </td>
              </template> -->
              <template #reason>
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.reason`) }}
                </th>
                <td>
                  <b-form-group
                    class="left_right"
                  >
                    <validation-provider
                      #default="{ errors }"
                      rules="required"

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
                </td>
              </template>
              <template #edit>
                <div class="mt-0 mb-1">
                  <feather-icon
                    v-if="hasPermission('edit_exam')"
                    @click="cancel()"
                    style="cursor: pointer"
                    icon="XCircleIcon"
                    class="font-medium-3"
                    v-b-tooltip.hover="$t('Global.close')"
                  />
                </div>
              </template>
            </ShowComponent>
          </b-overlay>
          <b-row>
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
    </div>
  </div>
</template>

<script>
import EditComponent from "@/views/components/table/Edit";
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
// import * as rules from "@validations";
import { PlusIcon, DeleteIcon } from "vue-feather-icons";
import ShowComponent from "@/views/components/info/show";
import {
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
  BOverlay,
  BBadge,
} from "bootstrap-vue";

export default {
  name: "edit",
  components: {
    EditComponent,
    ShowComponent,
    vSelect,
    ValidationErrors,
    required,
    extend,
    DeleteIcon,
    PlusIcon,
    BOverlay,
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
      errorsdata: {},
      form: {
        excuse_type: null,
        term: null,
        offerings: [],
        // file: null,
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
      return this.id ? this.$t("Edit Exam") : this.$t("Add Exam");
    },
  },
  props: {
    inline: { default: false, Type: Boolean },
    tabNumber: Number,
  },
  methods: {
    ...mapActions({
      getItem: "excuses/get",
    }),
    init() {
      if (this.id) {
        this.getItem(this.id).then((_) => {
          this.student = this.item.user;
          this.form.excuse_type = this.item.excuse_type.id;
          this.form.term = this.item.term ? this.item.term.id : null;
          // this.form.file = this.item.file;
          this.form.year_id = this.item.year ? this.item.year.id : null;
          this.form.user_id = this.item.user.id;
          this.form.reason = this.item.reason;
          this.item.offerings.forEach((element) => {
            this.form.offerings.push(element.id);
          });
        });
      }
    },
    cancel() {
      return this.$emit("hide");
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
              this.$router.go(-1);
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
  },
  mounted() {
    this.$store.dispatch("excuses/lookups").then(_=>{
      this.init();
    })
  },
};
</script>
