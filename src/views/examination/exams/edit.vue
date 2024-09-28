<template>
  <div>
    <div class="new_edit">
      <validation-observer ref="simpleRules">
        <b-form ref="form" @submit.stop.prevent="save">
          <ShowComponent 
            :loading="load"
            v-if="data" 
            :data="data" 
            :only="[
                'name',
                'name_local',
                'id',
                'type',
                'term',
                'schedule_due_date',
                'preferences_start_date',
                'preferences_end_date',
                'proctoring_table_date',
              ]" 
            >
            <template #name>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.name_custom`) }}
              </th>
              <td>
                <b-form-group 
                  label-for="name-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="english name"
                    rules="required|english"
                  >
                    <b-form-input
                      @keypress="
                        sanitizeEnglish($event);
                      "
                      id="name-input"
                      v-model="form.name"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('Global.english_name')"
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل الاسم باللغة الإنجليزية مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #name_local>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.arabic_name`) }}
              </th>
              <td>
                <b-form-group
                  label-for="nameAr-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="arabic name"
                    rules="required|arabic"
                  >
                    <b-form-input
                      id="nameAr-input"
                      class="right_left"
                      @keypress="
                        sanitizeArabic($event);
                        sanitizeNumber($event);
                      "
                      :placeholder="$t('Global.arabic_name')"
                      v-model="form.name_local"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل الاسم باللغة العربية مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template> 
            <template #id="{ data }">
              <th scope="row" :width="'20%'" v-if="$i18n.locale == 'en'">
                {{ $t(`Global.name_local`) }}
              </th>
              <td v-if="$i18n.locale == 'en'">
                <b-form-group 
                  label-for="name_local" 
                  invalid-feedback="Name is required"
                >
                  <validation-provider 
                    #default="{ errors }" 
                    name="name_local" 
                    rules="arabic|required"
                  >
                    <b-form-input 
                      :placeholder="$t('Global.arabic_name')" 
                      id="name_local" 
                      v-model="form.name_local" 
                      :state="errors.length > 0 ? false : null" 
                      @keypress="sanitizeArabic($event)" 
                    />
                    <ValidationErrors 
                      :frontend-errors="errors" 
                      :backend-errors="getBackendFieldError(errorsdata, 'name_local')" 
                    />
                  </validation-provider>
                </b-form-group>
              </td>
              <th scope="row" :width="'20%'" v-if="$i18n.locale == 'ar'">
                {{ $t(`Global.name_custom`) }}
              </th>
              <td v-if="$i18n.locale == 'ar'">
                <b-form-group 
                  label-for="name" 
                  invalid-feedback="Name is required"
                >
                  <validation-provider 
                    #default="{ errors }" 
                    name="name" 
                    rules="english|required"
                  >
                    <b-form-input 
                      :placeholder="$t('Global.name_custom')" 
                      id="name" 
                      v-model="form.name" 
                      :state="errors.length > 0 ? false : null" 
                      @keypress="sanitizeEnglish($event);" 
                    />
                    <ValidationErrors 
                      :frontend-errors="errors" 
                      :backend-errors="getBackendFieldError(errorsdata, 'name')" 
                    />
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #type>
              <th scope="row" :width="'20%'">
                  {{ $t(`Global.type`) }}
                </th>
                <td>
                  <b-form-group
                    class="left_right"
                    label-for="name-input"
                  >
                    <validation-provider
                      #default="{ errors }"
                      rules="required"
                      name="type"
                      v-if="lookups"
                    >
                      <v-select
                        v-model="form.type"
                        :label="getSelectLabel()"
                        :options="lookups.types"
                        :reduce="(val) => val.id"
                        :class="errors.length > 0 ? 'custom_invalid' : ''"
                        :placeholder="$t('type')"
                      />
                      <small
                          class="text-danger"
                          v-for="(error,index) in errors"
                          :key="index"
                      >
                        {{$i18n.locale == 'ar' ? 'حقل النوع مطلوب' : error }}
                      </small>
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
                    rules="required"
                    name="term"
                    v-if="lookups"
                  >
                    <v-select
                      v-model="form.term_id"
                      :label="getSelectLabel()"
                      :options="lookups.terms"
                      :reduce="(val) => val.id"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :placeholder="$t('Term')"
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل نصف السنة مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #schedule_due_date>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.schedule_due_date`) }}
              </th>
              <td>
                <b-form-group
                  label-for="schedule_due_date"
                >
                  <validation-provider name="preferences start date" #default="{ errors }" rules="required">
                    <b-form-datepicker
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      id="schedule_due_date"
                      ref="schedule_due_date"
                      v-model="form.schedule_due_date"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('schedule_due_date')"
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل تاريخ بدء التفضيلات مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #preferences_start_date>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.preferences_start_date`) }}
              </th>
              <td>
                <b-form-group
                  label-for="preferences_start_date"
                >
                  <validation-provider name="preferences start date" #default="{ errors }" :rules="{required: false}">
                    <b-form-datepicker
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      id="preferences_start_date"
                      ref="preferences_start_date"
                      v-model="form.preferences_start_date"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('preferences_start_date')"
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل تاريخ بدء التفضيلات مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #preferences_end_date>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.preferences_end_date`) }}
              </th>
              <td>
                <b-form-group
                  label-for="preferences_end_date"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="preferences end date"
                    :rules="{
                      required: false,
                      after: {
                        otherValue: {
                          value: form.preferences_start_date,
                          msg: $t('Validation.The date must be after the preferences start date'),
                        },
                      },
                    }"
                  >
                    <b-form-datepicker
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      id="preferences_end_date"
                      v-model="form.preferences_end_date"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('preferences_end_date')"
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل تاريخ انتهاء التفضيلات مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #proctoring_table_date>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.proctoring_table_date`) }}
              </th>
              <td>
                <b-form-group
                  label-for="proctoring_table_date"
                >
                  <validation-provider name="proctoring table date" #default="{ errors }" 
                  :rules="{
                      required: false,
                      after: {
                        otherValue: {
                          value: form.preferences_end_date,
                          msg: $t('Validation.The date must be after the preferences end date'),
                        },
                      },
                    }"
                  >
                    <b-form-datepicker
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      id="proctoring_table_date"
                      v-model="form.proctoring_table_date"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('proctoring_table_date')"
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل تاريخ جدول المراقبة مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #published>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.Published`) }}
              </th>
              <td>
                <b-form-group
                  class="left_right"
                  label-for="published"
                >
                  <validation-provider #default="{ errors }" rules="required">
                    <b-form-checkbox
                      id="published"
                      v-model="form.published"
                      value="1"
                      unchecked-value="0"
                      :placeholder="$t('Global.Published')"
                    />
                    <ValidationErrors
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'published')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #edit>
              <div class="mt-0 mb-1">
                <feather-icon v-if="hasPermission('edit_exam')" @click="cancel()" style="cursor: pointer"
                  icon="XCircleIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.close')" />
              </div>
            </template>
          </ShowComponent>
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
        type: null,
        term_id: null,
        faculty_id: null,
        name: null,
        name_local: null,
        periods: 1,
        schedule_due_date: null,
        preferences_start_date: null,
        preferences_end_date: null,
        proctoring_table_date: null,
        published: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      lookups: "exams/lookups",
      item: "exams/item",
      load: "exams/load",
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
    data: { default: {}, type: [Array, Object] },
  },
  methods: {
    ...mapActions({
      getItem: "exams/get",
    }),
    init() {
      if (this.id) {
        this.getItem(this.id).then((_) => {
          this.form.type = this.item.type.id;
          this.form.term_id = this.item.term_id;
          this.form.faculty_id = this.item.faculty_id;
          this.form.name = this.item.name;
          this.form.name_local = this.item.name_local;
          this.form.schedule_due_date = this.item.schedule_due_date;
          this.form.preferences_start_date = this.item.preferences_start_date;
          this.form.preferences_end_date = this.item.preferences_end_date;
          this.form.proctoring_table_date = this.item.proctoring_table_date;
          this.form.published = this.item.published;
        });
      }
    },
    cancel() {
      return this.$emit('hide');
    },
    save() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          const payload = { id: this.id, query: this.form };
          this.$store
            .dispatch("exams/put", payload)
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
              let message = error.response.data.errors.term_id.length > 0 ? this.$i18n.locale == 'ar' ? error.response.data.errors.term_id[0].ar : error.response.data.errors.term_id[0].en : this.$t("Global.errorMessage")
              this.$swal({
                icon: "error",
                text: message,
                showConfirmButton: false,
                timer: 3000,
              });
            });
        }
      });
    },
  },
  mounted() {
    extend("after", {
      params: ["otherValue"],
      message: (field, { otherValue }) => otherValue.msg,
      validate: (value, { otherValue }) =>
        value > otherValue.value ? true : false,
    });
    this.$store.dispatch("exams/lookups");
    this.init();
  },
};
</script>
