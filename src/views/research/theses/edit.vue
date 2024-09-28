<template>
  <div>
    <div class="new_edit">
      <validation-observer ref="simpleRules">
        <b-form ref="form" @submit.stop.prevent="save">
          <ShowComponent
            :loading="load"
            v-if="data"
            :data="data"
            :only="
            $route.name != 'add_thesis'?
              [
                'student',
                'plan',
                'title',
                'title_local',
                'id',
                'status',
              ]
            :
              [
                'student',
                'plan',
                'title',
                'title_local',
                'id',
              ]
            ">
            <template #student="{ data }">
                <th scope="row" :width="'20%'">
                    {{ $t(`Global.student`) }}
                </th>
                <td>
                  <b-form-group
                    label-for="student"
                  >
                    <validation-provider
                      #default="{ errors }"
                      rules="required"
                    >
                      <v-select
                        id="student"
                        v-model="form.student"
                        :options="students"
                        :class="errors.length > 0 ? 'custom_invalid' : ''"
                        :label="getSelectLabel()"
                        class="w-100"
                        :placeholder="$t('Global.search')"
                        :filterable="false"
                        clearable
                        :dir=" $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr' "
                        :reduce="(val) => val.id"
                        @search="fetchPostGrad"
                      >
                        <template #no-options>
                          {{ $t("search_input_text") }}
                        </template>
                      </v-select>
                      <ValidationErrors :frontend-errors="validationErrorMessage(errors)" />
                    </validation-provider>
                  </b-form-group>
                </td>
            </template>
            <template #plan="{ data }">
                <th scope="row" :width="'20%'">
                    {{ $t(`Global.research_plan`) }}
                </th>
                <td>
                  <b-form-group
                    label-for="type-input"
                  >
                    <validation-provider
                      #default="{ errors }"
                      :name="$t('Global.type')"
                      v-if="research_plans"
                    >
                      <v-select
                        v-model="form.research_plan_id"
                        :label="getSelectLabel()"
                        :options="research_plans"
                        :reduce="(val) => val.id"
                        :placeholder="$t('Global.research_plan')"
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
                    <!-- {{ $i18n.locale == 'ar' ? data.plan.name_local : data.plan.name }} -->
                </td>
            </template>
            <template #title="{ data }">
                <th scope="row" :width="'20%'">
                    {{ $t(`Global.english_title`) }}
                </th>
                <td>
                  <b-form-group
                    label-for="name-input"
                  >
                    <validation-provider
                      #default="{ errors }"
                      :name="$t('Global.english_title')"
                      rules="required|english"
                    >
                      <b-form-input
                        @keypress="
                          sanitizeEnglish($event);
                        "
                        v-model="form.title"
                        :state="errors.length > 0 ? false : null"
                        :placeholder="$t('Global.english_title')"
                      />
                      <small
                          class="text-danger"
                          v-for="(error,index) in errors"
                          :key="index"
                      >
                        {{$i18n.locale == 'ar' ? 'حقل العنوان باللغة الإنجليزية مطلوب' : error }}
                      </small>
                    </validation-provider>
                  </b-form-group>
                </td>
            </template>
            <template #title_local="{ data }">
                <th scope="row" :width="'20%'">
                    {{ $t(`Global.arabic_title`) }}
                </th>
                <td>
                  <b-form-group
                    label-for="name-input"
                  >
                    <validation-provider
                      #default="{ errors }"
                      :name="$t('Global.arabic_title')"
                      rules="required|arabic"
                    >
                      <b-form-input
                        @keypress="
                          sanitizeArabic($event);
                        "
                        v-model="form.title_local"
                        :state="errors.length > 0 ? false : null"
                        :placeholder="$t('Global.arabic_title')"
                      />
                      <small
                          class="text-danger"
                          v-for="(error,index) in errors"
                          :key="index"
                      >
                        {{$i18n.locale == 'ar' ? 'حقل العنوان باللغة العربية مطلوب' : error }}
                      </small>
                    </validation-provider>
                  </b-form-group>
                </td>
            </template>
            <template #id>
              <th scope="row" :width="'20%'" v-if="$i18n.locale == 'en'">
                {{ $t(`Global.arabic_title`) }}
              </th>
              <td v-if="$i18n.locale == 'en'">
                <b-form-group
                    label-for="name-input"
                  >
                    <validation-provider
                      #default="{ errors }"
                      :name="$t('Global.arabic_title')"
                      rules="required|arabic"
                    >
                      <b-form-input
                        @keypress="
                          sanitizeArabic($event);
                        "
                        v-model="form.title_local"
                        :state="errors.length > 0 ? false : null"
                        :placeholder="$t('Global.arabic_title')"
                      />
                      <small
                          class="text-danger"
                          v-for="(error,index) in errors"
                          :key="index"
                      >
                        {{$i18n.locale == 'ar' ? 'حقل العنوان باللغة العربية مطلوب' : error }}
                      </small>
                    </validation-provider>
                  </b-form-group>
              </td>
              <th scope="row" :width="'20%'" v-if="$i18n.locale == 'ar'">
                {{ $t(`Global.english_title`) }}
              </th>
              <td v-if="$i18n.locale == 'ar'">
                <b-form-group
                  label-for="name-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.english_title')"
                    rules="required|english"
                  >
                    <b-form-input
                      @keypress="
                        sanitizeEnglish($event);
                      "
                      v-model="form.title"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('Global.english_title')"
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل العنوان باللغة الإنجليزية مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <!-- <template #abstract="{ data }">
                <th scope="row" :width="'20%'">
                    {{ $t(`Global.english_abstract`) }}
                </th>
                <td>
                  <b-form-group
                    class="left_right"
                  >
                    <validation-provider
                      #default="{ errors }"
                      rules="required"
                      v-if="lookups"
                    >
                      <quill-editor
                        class="my-2"
                        v-model="form.abstract"
                        :options="snowOption"
                        @keypress="sanitizeEnglish($event);"
                      />
                      <ValidationErrors
                        :default-message="true"
                        :frontend-errors="errors"
                        :backend-errors="
                          getBackendFieldError(errorsdata, 'english_abstract')
                        "
                      />
                    </validation-provider>
                  </b-form-group>
                </td>
            </template>
            <template #abstract_local="{ data }">
                <th scope="row" :width="'20%'">
                    {{ $t(`Global.arabic_abstract`) }}
                </th>
                <td>
                  <b-form-group
                    class="left_right"
                  >
                    <validation-provider
                      #default="{ errors }"
                      rules="required"
                      v-if="lookups"
                    >
                      <quill-editor
                        class="my-2"
                        v-model="form.abstract_local"
                        :options="snowOption"
                        @keypress="sanitizeEnglish($event);"
                      />
                      <ValidationErrors
                        :default-message="true"
                        :frontend-errors="errors"
                        :backend-errors="
                          getBackendFieldError(errorsdata, 'arabic_abstract')
                        "
                      />
                    </validation-provider>
                  </b-form-group>
                </td>
            </template>
            <template #submitted_by>
              <th scope="row" :width="'20%'" v-if="$i18n.locale == 'en'">
                {{ $t(`Global.arabic_abstract`) }}
              </th>
              <td v-if="$i18n.locale == 'en'">
                <b-form-group
                  class="left_right"
                >
                  <validation-provider
                    #default="{ errors }"
                    rules="required"
                    v-if="lookups"
                  >
                    <quill-editor
                      class="my-2"
                      v-model="form.abstract_local"
                      :options="snowOption"
                      @keypress="sanitizeEnglish($event);"
                    />
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'arabic_abstract')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </td>
              <th scope="row" :width="'20%'" v-if="$i18n.locale == 'ar'">
                {{ $t(`Global.english_abstract`) }}
              </th>
              <td v-if="$i18n.locale == 'ar'">
                <b-form-group
                  class="left_right"
                >
                  <validation-provider
                    #default="{ errors }"
                    rules="required"
                    v-if="lookups"
                  >
                    <quill-editor
                      class="my-2"
                      v-model="form.abstract"
                      :options="snowOption"
                      @keypress="sanitizeEnglish($event);"
                    />
                    <ValidationErrors
                      :default-message="true"
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'english_abstract')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </td>
            </template> -->
            <template #status="{ data }">
                <th scope="row" :width="'20%'">
                    {{ $t(`Global.status`) }}
                </th>
                <td>
                    {{ $i18n.locale == 'ar' ? data.status.name_local : data.status.name }}
                </td>
            </template>
            <template #edit>
              <div class="mt-0 mb-1">
                <feather-icon @click="cancel()" style="cursor: pointer"
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
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { mapGetters, mapActions } from "vuex";
import { required } from "@validations";
import { PlusIcon, DeleteIcon } from "vue-feather-icons";
import ShowComponent from "@/views/components/info/show";
import DatePicker from "vue2-datepicker";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

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
  BOverlay,
  BFormDatepicker,
  BLink
} from "bootstrap-vue";

export default {
  name: "edit",
  components: {
    quillEditor,
    EditComponent,
    ShowComponent,
    vSelect,
    ValidationErrors,
    required,
    DeleteIcon,
    PlusIcon,
    BOverlay,
    BFormDatepicker,
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
    DatePicker,
    BLink
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      lookups: "theses/lookups",
      item: "theses/item",
      load: "theses/load",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    title() {
      return this.id
        ? this.$t("Global.thesis_edit")
        : this.$t("Global.thesis_add");
    },
  },
  props: {
    inline: { default: false, Type: Boolean },
    tabNumber: Number,
    data: { default: {}, type: [Array, Object] },
  },
  data() {
    return {
      errorsdata: {},
      students: [],
      waitFetchUsers: false,
      snowOption:{
        placeholder: 'Compose an epic...',
      },
      research_plans: [],
      form: {
        student: null,
        research_plan_id: null,
        title: null,
        title_local: null,
        abstract: null,
        abstract_local: null,
        student_id: null
      },
    };
  },

  methods: {
    ...mapActions({
      getItem: "theses/get",
      getLookups: "app/GET_LOOKUPS",
    }),
    init() {
      const query = {research_plans: true};
      this.getLookups(query)
        .then((response) => {
          this.research_plans = response.success.research_plans
        })
      if (this.id) {
        this.getItem(this.id).then((_) => {
          this.form.research_plan_id = this.item.plan ? this.item.plan.id : null;
          this.form.title = this.item.title;
          this.form.title_local = this.item.title_local;
          this.form.abstract = this.item.abstract ? this.item.abstract : null;
          this.form.abstract_local = this.item.abstract_local ? this.item.abstract_local : null ;
          this.form.student = this.item.student;
        });
      }
    },
    cancel() {
      if(!this.id){
        this.$router.go(-1)
      }
      if (this.inline) {
        return this.$emit('hide');
      }
    },
    save() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          this.form.student_id = typeof this.form.student == 'object' ? this.form.student.id : this.form.student
          const payload = { id: this.id, query: this.form };
          this.$store
            .dispatch("theses/put", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              if(this.$route.name == "add_thesis"){
                this.$router.go(-1)
              }else{
                this.init();
                this.$emit('hide');
              }
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
    validationErrorMessage(errors) {
      if (errors.length) {
        errors[0] = errors[0].replace(/\(.*?\)/gi, '')
      }
      return errors
    },
    fetchPostGrad(search, load, from) {
      if (search.length >= 3 && !this.waitFetchUsers) {
        this.waitFetchUsers = true;
        load(true)
        const query = {
          postgraduates: search,
        }
        this.getLookups(query).then(response => {
          this.students = response.success.postgraduates
          load(false)
          this.waitFetchUsers = false;
        })
      }
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped></style>
