<template>
  <div class="new_edit" v-if="item">
    <b-overlay :show="$store.getters['years/load']" rounded="sm">
      <validation-observer ref="simpleRules">
        <b-form ref="form" @submit.stop.prevent="save">
          <ShowComponent
            :data="item"
            :only="[
              'start_year',
              'copy',
              'academic_year',
              
              'copy_options',
              'mark_setup',
            ]"
          >
            <template #edit>
              <div class="mb-2">
                <feather-icon
                  v-b-tooltip.hover="$t('Global.close')"
                  style="cursor: pointer"
                  icon="XCircleIcon"
                  class="font-medium-3"
                  @click="cancel()"
                />
              </div>
            </template>
            <template #start_year="{ data }">
              <th scope="row" :width="'40%'">
                {{ $t(`Global.name`) }}
              </th>
              <td>
                <div class="d-flex justify-content-between w-100">
                  <b-form-group label-for="year-input" class="w-75">
                    <validation-provider
                      #default="{ errors }"
                      name="start_year"
                      rules="required"
                    >
                      <year-picker
                        @change="handlerInput"
                        v-model="form.start_year"
                        :year-disable="'no'"
                        :placeholder="$t('Global.start_year')"
                      />
                      <ValidationErrors
                        :frontend-errors="errors"
                        :backend-errors="
                          getBackendFieldError(errorsdata, 'year')
                        "
                      />
                    </validation-provider>
                  </b-form-group>
                  <div class="w-25" style="padding: 7px !important">
                    / {{ form.start_year + 1 }}
                  </div>
                </div>
              </td>
            </template>
            <template #copy="{ data }" v-if="!id">
              <th scope="row" :width="'30%'">
                <span> {{ $t(`Global.copy_course_offering`) }}</span>
              </th>
              <td>
                <div class="d-flex justify-content-between w-100">
                  <b-form-group class="d-flex">
                    <b-form-checkbox
                      v-model="form.replicate_offerings"
                      class="mx-1 mt-50"
                      switch
                      inline
                    />
                  </b-form-group>
                </div>
              </td>
            </template>
            <template #academic_year="{ data }" v-if="!id">
              <th
                scope="row"
                :width="'40%'"
                :style="form.replicate_offerings == 0 ? 'display:none' : ''"
              >
                <span> {{ $t(`Global.academic_years`) }}</span>
              </th>
              <td :style="form.replicate_offerings == 0 ? 'display:none' : ''">
                <div class="d-flex justify-content-between w-100">
                  <b-form-group class="w-75">
                    <validation-provider
                      #default="{ errors }"
                      name="replicate_offerings"
                      :rules="form.replicate_offerings != 0 ? 'required' : ''"
                    >
                      <v-select
                        v-if="$store.getters['app/lookups']"
                        v-model="form.replicate_year_id"
                        :class="errors.length > 0 ? 'custom_invalid' : ''"
                        :options="$store.getters['app/lookups'].academic_years"
                        class="w-100"
                        :label="getSelectLabel()"
                        :reduce="(val) => val.id"
                        dir=" $i18n.locale == 'en'? ltr : rtl"
                        :placeholder="$t('Global.academic_years')"
                        :disabled="form.replicate_offerings == 0"
                      >
                        <template v-slot:option="option">
                          {{ option.start_year }} / {{ option.end_year }}
                        </template>
                        <template #selected-option="option">
                          {{ option.start_year }} / {{ option.end_year }}
                        </template>
                        <template #no-options>
                          {{ $t("noMatching") }}
                        </template>
                      </v-select>
                      <small v-if="errors.length" class="text-danger">{{
                        validation(null, 0).message
                      }}</small>
                    </validation-provider>
                  </b-form-group>
                </div>
              </td>
            </template>
           <!--  <template #mark_setup="{ data }" v-if="!id">
              <th
                scope="row"
                :width="'40%'"
                :style="form.replicate_offerings == 0 ? 'display:none' : ''"
              >
                <b-form-group class="d-flex">
                  <span> {{ $t(`Global.marks_setup`) }}</span>
                </b-form-group>
              </th>
              <td :style="form.replicate_offerings == 0 ? 'display:none' : ''">
                <div class="demo-inline-spacing">
                  <b-form-radio
                    v-model="form.mark_setup_type"
                    name="some-radio9"
                    value=0
                    class="custom-control-primary"
                    :disabled="form.replicate_offerings == 0"
                  >
                    {{ $t("Global.offering_setup") }}
                    <small style="font-style: italic">
                      ({{ $t("Global.copy same offerings mark setup") }})</small
                    >
                  </b-form-radio>
                  <b-form-radio
                    v-model="form.mark_setup_type"
                    name="some-radio9"
                    value=1
                    class="custom-control-primary"
                    :disabled="form.replicate_offerings == 0"
                  >
                    {{ $t("Global.course_setup") }}
                    <small style="font-style: italic">
                      ({{
                        $t("Global.copy marks from course assessment criteria")
                      }})</small
                    >
                  </b-form-radio>
                </div>
              </td>
            </template> -->
            <template #copy_options="{ data }" v-if="!id">
              <th
                scope="row"
                :width="'40%'"
                :style="form.replicate_offerings == 0 ? 'display:none' : ''"
              >
                <b-form-group class="d-flex">
                  <span> {{ $t(`Global.options`) }}</span>
                </b-form-group>
              </th>
              <td :style="form.replicate_offerings == 0 ? 'display:none' : ''">
                <div class="demo-inline-spacing">
                 
                  <b-form-group class="d-flex">
                    <b-form-checkbox
                      v-model="form.replicate_bylaw_settings"
                      class="mb-1 mt-50"
                      :disabled="true"
                      inline
                    >
                      <span> {{ $t(`Global.replicate_bylaw_settings`) }}</span>
                    </b-form-checkbox>
                  </b-form-group>

                  <b-form-group class="d-flex">
                    <b-form-checkbox
                      v-model="form.replicate_offering_instructors"
                      class="mb-1 mt-50"
                      inline
                      :disabled="true"
                    >
                      <span>
                        {{ $t(`Global.replicate_offering_instructors`) }}</span
                      >
                    </b-form-checkbox>
                  </b-form-group>
                 
                  <b-form-group class="d-flex">
                    <b-form-checkbox
                      v-model="form.replicate_offering_schedules"
                      class="mb-1 mt-50"
                      :disabled="true"
                      inline
                    >
                      <span>
                        {{ $t(`Global.replicate_offering_schedules`) }}</span
                      >
                    </b-form-checkbox>
                  </b-form-group>
                 
                </div>
              </td>
            </template>
          </ShowComponent>

          <b-row>
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
    </b-overlay>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Years from "@/views/system/years/components/years";
import {
  BCard,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BForm,
  BButton,
  BFormDatepicker,
  BFormRadio,
  BOverlay,
} from "bootstrap-vue";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { required, email } from "@validations";
import EditComponent from "@/views/components/table/Edit";
import ShowComponent from "@/views/components/info/show";

export default {
  title: "Edit",
  components: {
    Years,
    BFormDatepicker,
    EditComponent,
    BCard,
    BCol,
    ShowComponent,
    BRow,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    ValidationErrors,
    BForm,
    BButton,
    vSelect,
    ValidationProvider,
    ValidationObserver,
    localize,
    BFormRadio,
    BOverlay,
  },
  directives: {
    Ripple,
  },
  props: {
    inline: { default: false, Type: Boolean },
    item: { default: { start_year: "", end_year: "" }, type: [Array, Object] },
  },
  computed: {
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    types() {
      return [
        { type: 1, label: this.$t("Global.Scientific") },
        { type: 2, label: this.$t("Global.Literary") },
      ];
    },
    title() {
      // return this.id ? this.$t('Global.edit_section') +' '+ item.section : this.$t('Global.add_section')
      return this.id
        ? this.$t("Global.faculty_edit")
        : this.$t("Global.faculty_add");
    },
  },
  data() {
    return {
      show: true,
      nameState: null,
      nameLocalState: null,
      codeState: null,
      errorsdata: {},
      form: {
        start_year: null,
        end_year: null,
        replicate_offerings: 0,
        replicate_year_id: null,
        mark_setup_type: 0,
        replicate_offering_instructors: true,
        replicate_offering_schedules: true,
        replicate_bylaw_settings: true,
      },
      message: null,
      /* replicate_offerings: 0,
      replicate_year_id: null,
      mark_setup_type: 0,
      replicate_offering_instructors: false,
      replicate_offering_schedules: false,
      replicate_bylaw_settings: false, */
    };
  },
  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.show = true;
      if (this.id && this.item) {
        this.form.start_year = this.item.start_year;
        this.form.end_year = this.item.end_year;
      }

      // if (this.id && this.$store.getters['years/item']){
      //     // this.$store.dispatch('years/get', this.id).then(_ => {
      //       this.form  = this.$store.getters['years/item']
      //     // });
      // }

      if (!this.id) {
        this.item = {
          start_year: "",
          end_year: "",
          copy: "",
          mark_setup: "",
          copy_options: "",
          academic_year: "",
        };
      }
      this.show = false;
    },
    getSelectLabel() {
      return "start_year";
    },
    showOverlay() {
      this.show = true;
      // document.querySelector('.year-picker__year-box').style.display = 'block';
    },
    handlerInput(e) {
      this.form.end_year = this.form.start_year + 1;
    },
    handleCopyOffering(e) {
      // this.form.end_year = this.form.start_year + 1;
    },
    hideYear() {
      // document.querySelector('.year-picker__input.year-picker__input--real').classList.remove('year-picker__input--focus');
      // document.querySelector('.year-picker__year-box').style.display = 'none';
      // document.querySelector('.year-picker__input.year-picker__input--real').blur();
    },
    checkIfArabic(type) {
      const arabic = /[\u0600-\u06FF]/;
      if (type == "en") {
        if (arabic.test(this.form.name)) {
          this.form.name = "";
        } else {
          return this.form.name;
        }
      } else if (type == "ar") {
        if (!arabic.test(this.form.name_local)) {
          this.form.name_local = "";
        } else {
          return this.form.name_local;
        }
      }
    },
    save() {
      this.$refs.simpleRules.validate().then((success) => {
        this.show = true;
        if (success) {
          this.form.end_year = this.form.start_year + 1;
          const payload = { id: this.id, query: this.form };

          this.$store.dispatch("years/put", payload).then((response) => {
            this.$swal({
              icon: "success",
              title: `${this.$t("Global.saved")}`,
              showConfirmButton: false,
              timer: 1500,
            });

            this.$emit("refresh", response.data.id);
            if (!this.$route.params.id) {
              this.$router
                .push({ name: "year", params: { id: response.data.id } })
                .then((_) => {})
                .catch(() => {});
            }
            return this.$emit("hide");
          }).catch(error => {
                this.$swal({
                    icon: 'error',
                    text: `${this.$t('Academic year already exist')}`,
                    showConfirmButton: false,
                    timer: 2000,
                });
            });
        }
        this.show = false;
      });
    },

    cancel() {
      if (!this.$route.params.id) {
        this.$router.go(-1);
      }
      if (this.inline) {
        return this.$emit("hide");
      }
    },
  },
};
</script>

<style lang="scss">
</style>
