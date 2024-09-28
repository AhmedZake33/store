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
              <b-col md="6">
                <b-form-group
                  class="left_right"
                  :label="$t('Global.title')"
                  label-for="title-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    rules="required"
                  >
                    <b-form-input 
                      id="title-input" 
                      v-model="form.title" 
                    />
                    <ValidationErrors
                      :frontend-errors="errors"
                      :backend-errors="getBackendFieldError(errorsdata, 'name')"
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  :state="regularStartDateState"
                  :label="$t('Global.start_time')"
                  label-for="regular-date-start-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    rules="required"
                  >
                    <flat-pickr
                      v-model="form.start"
                      class="form-control"
                      :config="{
                        enableTime: true,
                        noCalendar: true,
                        dateFormat: 'H:i',
                      }"
                    />
                    <ValidationErrors
                      :frontend-errors="errors"
                      :backend-errors="getBackendFieldError(errorsdata, 'start')"
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  :state="regularEndDateState"
                  :label="$t('Global.end_time')"
                  label-for="regular-date-end-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    rules="required"
                  >
                    <flat-pickr
                      v-model="form.end"
                      class="form-control"
                      :style="[
                        regularFlag
                          ? { 'background-color': '#eee' }
                          : { 'background-color': '#fff' },
                      ]"
                      :disabled="regularFlag"
                      :config="{
                        enableTime: true,
                        noCalendar: true,
                        dateFormat: 'H:i',
                        minDate: form.start,
                      }"
                    />
                    <ValidationErrors
                      :frontend-errors="errors"
                      :backend-errors="getBackendFieldError(errorsdata, 'end')"
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- submit and reset -->
              <b-col md="12 mt-3" v-if="hasPermission('edit_examSlot')">
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
import flatPickr from "vue-flatpickr-component";
import EditComponent from "@/views/components/table/Edit";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { mapGetters, mapActions } from "vuex";
import { required } from "@validations";
import { PlusIcon, DeleteIcon } from "vue-feather-icons";
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
  BFormDatepicker,
  BPopover,
} from "bootstrap-vue";
import { forEach } from "postcss-rtl/lib/affected-props";

export default {
  name: "edit",
  components: {
    EditComponent,
    vSelect,
    ValidationErrors,
    required,
    DeleteIcon,
    PlusIcon,
    flatPickr,
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
    BFormDatepicker,
    localize,
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      lookups: "examSlots/lookups",
      item: "examSlots/item",
      load: "examSlots/load",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    title() {
      return this.id ? this.$t("Global.slot_edit") : this.$t("Global.slot_add");
    },
  },
  watch: {
    "form.start": {
      handler(newVal, oldVal) {
        this.regularFlag = newVal != null ? false : true;
      },
      deep: true,
    },
  },
  data() {
    return {
      errorsdata: {},
      dateNtim: null,
      regularFlag: true,
      regularStartDateState: null,
      regularEndDateState: null,
      form: {
        title: null,
        start: null,
        end: null,
      },
    };
  },
  methods: {
    ...mapActions({
      //getLookups: 'slots/slots',
      getItem: "examSlots/get",
    }),
    init() {
      //this.getLookups()
      if (this.id) {
        this.getItem(this.id).then((_) => {
          this.form.title = this.item.title;
          this.form.start = this.item.start;
          this.form.end = this.item.end;
        });
      }
    },
    cancel() {
      this.$router.push({ name: "schedule-settings", query: { tabNum: 3 } });
    },
    save() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          const payload = { id: this.id, query: this.form };
          this.$store
            .dispatch("examSlots/put", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.$router.push({
                name: "schedule-settings",
                query: { tabNum: 3 },
              });
            })
            .catch(error => {
              let backendErrors = []
              error.response.data.errors.end.forEach((el)=>{
                return this.$i18n.locale == 'ar' ? backendErrors.push(el.ar) : backendErrors.push(el.en)
              });
              this.$swal({
                icon: 'error',
                text: backendErrors,
                showConfirmButton: false,
                timer: 1500,
              })
          })
        }
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped lang="scss">
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>
