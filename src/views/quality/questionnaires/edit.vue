<template>
  <div>
    <div class="new_edit">
      <validation-observer ref="simpleRules">
        <b-form ref="form" @submit.stop.prevent="save"> 
          <ShowComponent 
            :loading="load"
            v-if="data" 
            :data="data" 
            :only=" [
                'questionnaire_type',
                'destination',
                'faculty',
                'bylaw',
                'program',
                'course',
                'starts_at',
                'ends_at',
                'type',
                hasPermission('active_questionnaire') ? 'active' : ''
              ]" 
            >
            <template #questionnaire_type>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.questionnaire_type`) }}
              </th>
              <td>
                <b-form-group
                  label-for="questionnaires-types-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.questionnaire_type')"
                    rules="required"
                    v-if="lookups"
                  >
                    <v-select
                      v-model="form.questionnaire_type_id"
                      :label="getSelectLabel()"
                      :options="lookups.questionnaires_types"
                      :reduce="(val) => val.id"
                      :placeholder="$t('Global.questionnaire_type')"
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل نوع الاستبيان مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #destination>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.destination`) }}
              </th>
              <td v-if="id">
                <ul class="m-0" v-if="item.destination && item.destination.length > 0">
                  <li v-for="(element, index) in item.destination" :key="index">
                    {{ $i18n.locale == 'ar' ? element.name_local : element.name }}
                  </li>
                </ul>
              </td>
              <td v-else>
                <b-form-group
                  label-for="questionnaires-types-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.destination')"
                    :rules="'required'"
                    v-if="lookups"
                  >
                    <v-select
                      v-model="form.destination"
                      :label="getSelectLabel()"
                      :options="lookups.destinations"
                      class="disabled"
                      :reduce="(val) => val.id"
                      :disabled="id ? true : false"
                      multiple
                      :placeholder="$t('Global.destination')"
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل الوجهة مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
              
            </template>
            <template #faculty v-if="form.destination == 3">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.faculty`) }}
              </th>
              <td>
                <b-form-group
                  label-for="questionnaires-types-input"
                >
                    <v-select
                      v-model="form.faculty_ids"
                      :label="getSelectLabel()"
                      :options="lookups.faculties"
                      :reduce="(val) => val.id"
                      multiple
                      :placeholder="$t('Global.faculty')"
                    />
                </b-form-group>
              </td>
            </template>
            <template #bylaw v-if="form.faculty_ids && form.faculty_ids.length == 1">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.bylaw`) }}
              </th>
              <td>
                <b-form-group
                  label-for="questionnaires-types-input"
                >
                    <v-select
                      v-model="form.bylaw_ids"
                      :label="getSelectLabel()"
                      :options="lookups.bylaws"
                      :reduce="(val) => val.id"
                      multiple
                      :placeholder="$t('Global.bylaw')"
                    />
                </b-form-group>
              </td>
            </template>
            <template #program v-if="form.bylaw_ids && form.bylaw_ids.length == 1">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.program`) }}
              </th>
              <td>
                <b-form-group
                  label-for="questionnaires-types-input"
                >
                    <v-select
                      v-model="form.program_ids"
                      :label="getSelectLabel()"
                      :options="lookups.programs"
                      :reduce="(val) => val.id"
                      multiple
                      :placeholder="$t('Global.program')"
                    />
                </b-form-group>
              </td>
            </template>
            <template #course v-if="item">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.offering`) }}
              </th>
              <td v-if="item && item.course">
                <b-link
                    class="font-weight-bold custom_link d-block text-primary cursor-pointer"
                    :to="{
                      name: 'offering',
                      params: { id: item.offering_id },
                    }"
                >
                {{ $i18n.locale == 'ar' ? `${item.course.code} &nbsp; ${item.course.name_local}` : `${item.course.code} &nbsp; ${item.course.name}` }}
                </b-link>
              </td>
            </template>
            <template #course v-else-if="form.program_ids && form.program_ids.length == 1">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.course`) }}
              </th>
              <td>
                <b-form-group
                  label-for="questionnaires-types-input"
                >
                    <v-select
                      v-model="form.course_ids"
                      :label="getSelectLabel()"
                      :options="lookups.courses"
                      :reduce="(val) => val.id"
                      multiple
                      :placeholder="$t('Global.course')"
                    />
                </b-form-group>
              </td>
            </template>
            <template #starts_at>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.start_date`) }}
              </th>
              <td>
                <b-form-group
                  label-for="date-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="date"
                    :rules="{
                      required: true,
                    }"
                  >
                    <date-picker 
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      type="datetime"
                      id="date-input"
                      v-model="form.starts_at"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('Global.start_date')"
                      class="w-100"
                      valueType="format"  
                    >
                    </date-picker>
                    <!-- <b-form-datepicker
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      id="date-input"
                      v-model="form.starts_at"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('Global.start_date')"
                      date-format-options=""
                    /> -->
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar"
                          ? `حقل ${$t("Global.start_date")} مطلوب`
                          : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #ends_at>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.end_date`) }}
              </th>
              <td>
                <b-form-group
                  label-for="end_date"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="end date"
                    :rules="{
                      required: true,
                    }"
                  >
                      <date-picker 
                        :label-no-date-selected="$t('Global.no_selected')"
                        :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                        type="datetime"
                        id="end_date"
                        v-model="form.ends_at"
                        :state="errors.length > 0 ? false : null"
                        :placeholder="$t('Global.end_date')"
                        class="w-100"
                        valueType="format"  
                      >
                      </date-picker>
                    <!-- <b-form-datepicker
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      id="end_date"
                      v-model="form.ends_at"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('Global.end_date')"
                    /> -->
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل تاريخ الانتهاء مطلوب' : error }}
                    </small>
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
                  label-for="type-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.type')"
                    rules="required"
                    v-if="lookups"
                  >
                    <v-select
                      v-model="form.type"
                      :label="getSelectLabel()"
                      :options="lookups.types"
                      :reduce="(val) => val.id"
                      :placeholder="$t('Global.type')"
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
            <template #active v-if="hasPermission('active_questionnaire')">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.active`) }}
              </th>
              <td>
                <b-form-group
                  label-for="active-input"
                >
                  <b-form-checkbox
                    v-model="form.active"
                    class="mr-0 mt-50"
                  />
                </b-form-group>
              </td>
            </template>
            <!-- <template #edit>
              <div class="mt-0 mb-1">
                <feather-icon v-if="hasPermission('edit_exam')" @click="cancel()" style="cursor: pointer"
                  icon="XCircleIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.close')" />
              </div>
            </template> -->
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
  BLink,
  BFormCheckbox
} from "bootstrap-vue";

export default {
  name: "edit",
  components: {
    EditComponent,
    ShowComponent,
    vSelect,
    ValidationErrors,
    required,
    DeleteIcon,
    PlusIcon,
    BFormDatepicker,
    ValidationProvider,
    BFormCheckbox,
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
    BLink,
    DatePicker
  },
  directives: {
    Ripple,
  },
  watch:{
    'form.destination'(val){
      if(val == 3){
        const payload = { faculties: true , bylaws: true , programs: true , courses: true }
        this.$store.dispatch('questionnaires/getQuestionnaireLookups', payload)
      }
    },
    'form.faculty_ids'(val){
      if(val){
        const payload = { faculties: true , bylaws: true ,  faculty_id: this.form.faculty_ids}
        this.$store.dispatch('questionnaires/getQuestionnaireLookups', payload)
      }
    },
    'form.bylaw_ids'(val){
      if(val){
        const payload = { faculties: true , bylaws: true, programs: true, bylaw_id: this.form.bylaw_ids , faculty_id: this.form.faculty_ids}
        this.$store.dispatch('questionnaires/getQuestionnaireLookups', payload)
      }
    },
    'form.program_ids'(val){
      if(val){
        const payload = { faculties: true, bylaws: true, courses: true, faculty_id: this.form.faculty_ids, bylaw_id: this.form.bylaw_ids, programs: true, program_id: this.form.program_ids  }
        this.$store.dispatch('questionnaires/getQuestionnaireLookups', payload)
      }
    },
    'form.course_ids'(val){
      if(val){
        const payload = { faculties: true , bylaws: true , programs: true , course_id: this.form.course_ids , courses: true, faculty_id: this.form.faculty_ids, bylaw_id: this.form.bylaw_ids, program_id: this.form.program_ids }
        this.$store.dispatch('questionnaires/getQuestionnaireLookups', payload)
      }
    },
  },
  computed: {
    ...mapGetters({
      lookups: "questionnaires/lookups",
      item: "questionnaires/item",
      load: "questionnaires/load",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    title() {
      return this.id
        ? this.$t("Global.questionnaires_edit")
        : this.$t("Global.questionnaires_add");
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
      form: {
        questionnaire_type_id: null,
        destination:[],
        starts_at: null,
        ends_at: null,
        type: null,
        active: false
      },
    };
  },
  
  methods: {
    ...mapActions({
      getItem: "questionnaires/get",
    }),
    init() {
      if (this.id) {
        this.getItem(this.id).then((_) => {
          this.form.questionnaire_type_id = this.item.questionnaire_type.id;
          this.form.starts_at = this.item.starts_at;
          this.form.ends_at = this.item.ends_at;
          this.form.type = this.item.type.id;
          this.form.active = this.item.active == 'Active' ? true : false;
          if(this.item.course){
            this.form.faculty_ids = this.item.course.bylaw.faculty_id
            this.form.bylaw_ids = this.item.course.bylaw.id
            this.form.course_ids = this.item.course.id
          }
          this.item.destination.forEach((el)=>{
            this.form.destination.push(el.id)
          })
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
          if(this.form.course_ids && this.form.course_ids.length > 0){
            delete this.form.faculty_ids
            delete this.form.bylaw_ids
            delete this.form.program_ids
          }
          else if(this.form.program_ids && this.form.program_ids.length > 0){
            delete this.form.faculty_ids
            delete this.form.bylaw_ids
            delete this.form.course_ids
          }
          else if(this.form.bylaw_ids && this.form.bylaw_ids.length > 0){
            delete this.form.faculty_ids
            delete this.form.program_ids
            delete this.form.course_ids
          }
          else if(this.form.faculty_ids && this.form.faculty_ids.length > 0){
            delete this.form.bylaw_ids
            delete this.form.program_ids
            delete this.form.course_ids
          }
          
          const payload = { id: this.id, query: this.form };
          this.$store
            .dispatch("questionnaires/put", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              if(this.$route.name == "add_questionnaire"){
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
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped>
/deep/ .disabled {
  cursor: not-allowed;
  pointer-events: all !important;
  color: #000 !important;
  background-color: #f00 !important;
}

.vs--disabled .vs__dropdown-toggle, .vs--disabled .vs__clear, .vs--disabled .vs__search, .vs--disabled .vs__selected, .vs--disabled .vs__open-indicator{
  background-color: #f00 !important;

}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
</style>
