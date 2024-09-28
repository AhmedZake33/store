<template>
  <div>
    <edit-component :name="name" :loading="appLoad">
      <template #inputs>
        <validation-observer ref="simpleRules">
          <b-form>
            <h4 class="mb-1">
              {{ $t('Global.details') }}
            </h4>
            <b-row>
              <b-col md="4">
                <b-form-group :label="$t('Global.name')" label-for="mc-course">
                  <validation-provider #default="{ errors }" name="name" rules="required">
                    <b-form-input id="name-input" v-model="form.name" :state="errors.length > 0 ? false : null" />
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group :label="$t('Global.year')" label-for="mc-course">
                  <validation-provider #default="{ errors }" name="term" rules="required">
                    <b-form-input id="name-input" v-model="form.year" :state="errors.length > 0 ? false : null" />
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col md="4">
                <b-form-group :label="$t('Global.term')" label-for="mc-program">
                  <validation-provider #default="{ errors }" name="instructors" rules="required">
                    <v-select id="mc-program" v-model="form.term_id" :options="lookups.terms" :class="errors.length > 0 ? 'custom_invalid' : ''" :label="getSelectLabel()" class="w-100" clearable>
                      <template slot="no-options">
                        <div v-if="loadTerms">
                          {{ $t('Global.loading') }}
                        </div>
                        <div v-else>
                          {{ $t('Global.searchInTerms') }}
                        </div>
                      </template>
                      <template slot="selected-option" slot-scope="option">
                        <span v-if="$i18n.locale == 'ar'">
                          {{ option.name_local || option.name }}
                          <!-- {{ option.bylaw.name_local }} -
                        {{ option.bylaw.faculty.name_local }} -->
                        </span>
                        <span v-else>
                          {{ option.name || option.name_local }}
                          <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                        {{ option.bylaw ? option.bylaw.faculty.name : '' }} -->
                        </span>
                      </template>
                      <template v-slot:option="option">
                        {{ $i18n.locale == 'ar' ? option.name_local || option.name : option.name || option.name_local }}
                      </template>
                      <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
                    <template #no-options>
  {{ $t('noMatching') }}
</template>
</v-select>
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group :label="$t('Global.faculty')" label-for="mc-course">
                  <validation-provider #default="{ errors }" name="faculty" rules="required">
                    <v-select :filter="fuseSearch" id="mc-course" v-model="form.faculty_id" :options="lookups.faculties" :class="errors.length > 0 ? 'custom_invalid' : ''" :label="getSelectLabel()" class="w-100" clearable>
                      <template slot="selected-option" slot-scope="option">
                        <span v-if="$i18n.locale == 'ar'">
                          {{ option.name_local || option.name }}
                          <!-- {{ option.bylaw.name_local }} -
                        {{ option.bylaw.faculty.name_local }} -->
                        </span>
                        <span v-else>
                          {{ option.name || option.name_local }}
                          <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                        {{ option.bylaw ? option.bylaw.faculty.name : '' }} -->
                        </span>
                      </template>
                      <template v-slot:option="option">
                        {{ $i18n.locale == 'ar' ? option.name_local || option.name : option.name || option.name_local }}
                      </template>
                      <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
                  
</v-select>
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group :label="$t('Global.bylaws')" label-for="mc-course">
                  <validation-provider #default="{ errors }" name="bylaw" rules="required">
                    <v-select :filter="fuseSearch" id="mc-course" v-model="form.bylaw_id" :options="bylaws || []" :disabled="!form.faculty_id" :class="errors.length > 0 ? 'custom_invalid' : ''" :label="getSelectLabel()" class="w-100" clearable>
                      <template slot="selected-option" slot-scope="option">
                        <span v-if="$i18n.locale == 'ar'">
                          {{ option.name_local || option.name }}
                          <!-- {{ option.bylaw.name_local }} -
                        {{ option.bylaw.faculty.name_local }} -->
                        </span>
                        <span v-else>
                          {{ option.name || option.name_local }}
                          <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                        {{ option.bylaw ? option.bylaw.faculty.name : '' }} -->
                        </span>
                      </template>
                      <template v-slot:option="option">
                        {{ $i18n.locale == 'ar' ? option.name_local || option.name : option.name || option.name_local }}
                      </template>
                      <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
               
</v-select>
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group :label="$t('Global.program')" label-for="mc-program">
                  <validation-provider #default="{ errors }" name="programs" rules="required">
                    <v-select :filter="fuseSearch" id="mc-program" v-model="form.program_id" :options="programs || []" :disabled="!form.bylaw_id" :label="getSelectLabel()" class="w-100" :class="errors.length > 0 ? 'custom_invalid' : ''" clearable>
                      <template slot="selected-option" slot-scope="option">
                        <span v-if="$i18n.locale == 'ar'">
                          {{ option.name_local || option.name }}
                          <!-- {{ option.bylaw.name_local }} -
                        {{ option.bylaw.faculty.name_local }} -->
                        </span>
                        <span v-else>
                          {{ option.name || option.name_local }}
                          <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                        {{ option.bylaw ? option.bylaw.faculty.name : '' }} -->
                        </span>
                      </template>
                      <template v-slot:option="option">
                        {{ $i18n.locale == 'ar' ? option.name_local || option.name : option.name || option.name_local }}
                      </template>
                      <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
                
</v-select>
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- <b-col md="4">
                <b-form-group :label="$t('Global.math_required')" label-for="mc-program">
                  <validation-provider #default="{ errors }" name="math_required" rules="required">
                    <v-select id="mc-program" v-model="form.math_required" :options="assemblyOptions" :label="getSelectLabel()" class="w-100" :reduce="name => name.id" :class="errors.length > 0 ? 'custom_invalid' : ''" clearable>
                      <template slot="selected-option" slot-scope="option">
                        <span v-if="$i18n.locale == 'ar'">
                          {{ option.name_local || option.name }}
                        </span>
                        <span v-else>
                          {{ option.name || option.name_local }}
                        </span>
                      </template>
                      <template v-slot:option="option">
                        {{ $i18n.locale == 'ar' ? option.name_local || option.name : option.name || option.name_local }}
                      </template>
                    <template #no-options>
  {{ $t('noMatching') }}
</template>
</v-select>
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col> -->
              <!-- <b-col md="4">
                <b-form-group :label="$t('Global.physics_required')" label-for="mc-program">
                  <validation-provider #default="{ errors }" name="physics_required" rules="required">
                    <v-select id="mc-program" v-model="form.physics_required" :options="assemblyOptions" :label="getSelectLabel()" class="w-100" :reduce="name => name.id" :class="errors.length > 0 ? 'custom_invalid' : ''" clearable>
                      <template slot="selected-option" slot-scope="option">
                        <span v-if="$i18n.locale == 'ar'">
                          {{ option.name_local || option.name }}
                        </span>
                        <span v-else>
                          {{ option.name || option.name_local }}
                        </span>
                      </template>
                      <template v-slot:option="option">
                        {{ $i18n.locale == 'ar' ? option.name_local || option.name : option.name || option.name_local }}
                      </template>
                    <template #no-options>
  {{ $t('noMatching') }}
</template>
</v-select>
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col> -->
              <b-col md="4">
                <b-form-group :label="$t('Global.quota')" label-for="mc-max_total" type="number">
                  <validation-provider #default="{ errors }" name="quota" rules="required">
                    <b-form-input id="mc-max_total" v-model="form.quota" :state="errors.length > 0 ? false : null" type="text" />
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group :label="$t('Global.pre_exam_fees')" label-for="mc-course">
                  <validation-provider #default="{ errors }" name="pre_exam_fees" rules="required">
                    <b-form-input id="name-input" v-model="form.pre_exam_fees" :state="errors.length > 0 ? false : null" />
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row v-if="form.term">
              <b-col md="12" class="mt-2">
                <h5>{{ $t('Global.offering_settings') }}</h5>
                <hr />
              </b-col>
              <b-col md="4">
                <b-form-group :label="$t('Global.num_group')" label-for="mc-group">
                  <validation-provider #default="{ errors }" name="num_groups" rules="required">
                    <b-form-input id="mc-group" v-model="form.num_groups" :state="errors.length > 0 ? false : null" type="number" :readonly="disable_inputs" />
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group :label="$t('Global.num_section')" label-for="mc-section">
                  <validation-provider #default="{ errors }" name="num_sections" rules="required">
                    <b-form-input id="mc-section" v-model="form.num_sections" :state="errors.length > 0 ? false : null" type="number" />
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group></b-col
              >
              <!-- <b-col
                v-if="!disable_inputs"
                md="4"
              >
                <b-form-group
                  :label="$t('Global.section_group')"
                  label-for="mc-section_group"
                >
                  <b-form-input
                    id="mc-section_group"
                    v-model="form.section_group"
                    type="number"
                    :readonly="disable_inputs"
                  />
                </b-form-group>
              </b-col> -->
              <b-col md="4">
                <b-form-group :label="$t('Global.quota')" label-for="mc-quota">
                  <validation-provider #default="{ errors }" name="section_quota" rules="required">
                    <b-form-input id="mc-quota" v-model="form.section_quota" :state="errors.length > 0 ? false : null" type="number" />
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group :label="$t('Global.over_quota')" label-for="mc-over_quota">
                  <validation-provider #default="{ errors }" name="section_over_quota" rules="required">
                    <b-form-input id="mc-over_quota" v-model="form.section_over_quota" :state="errors.length > 0 ? false : null" type="number" />
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
            </b-row>
            <hr />
            <h4 class="my-1">
              {{ $t('Global.certificates') }}
            </h4>
            <b-row>
              <b-col md="4">
                <b-form-group :label="$t('Global.certificate')" label-for="mc-program">
                  <validation-provider #default="{ errors }" name="pre_university_certificate_groupe" rules="required">
                    <v-select :filter="fuseSearch" v-model="form.pre_university_certificate_groupe" :options="certificate_sections" :reduce="el => el.id" :class="errors.length > 0 ? 'custom_invalid' : ''" :label="getSelectLabel()" class="w-100" clearable>
                      <template slot="selected-option" slot-scope="option">
                        <span v-if="$i18n.locale == 'ar'">
                          {{ option.name_local || option.name }}
                        </span>
                        <span v-else>
                          {{ option.name || option.name_local }}
                          <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                        {{ option.bylaw ? option.bylaw.faculty.name : '' }} -->
                        </span>
                      </template>
                      <template v-slot:option="option">
                        {{ $i18n.locale == 'ar' ? option.name_local || option.name : option.name || option.name_local }}
                      </template>
                      <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
              
</v-select>
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group :label="$t('Global.pre_university_certificate')" label-for="mc-program">
                  <validation-provider #default="{ errors }" name="pre_university_certificate" rules="required">
                    <v-select
                      v-model="form.pre_university_certificate"
                      :options="certificates"
                      :filter="fuseSearch"
                      :reduce="el => el.id"
                      :disabled="!form.pre_university_certificate && !form.pre_university_certificate_groupe"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :label="getSelectLabel()"
                      class="w-100"
                      clearable
                    >
                      <template slot="selected-option" slot-scope="option">
                        <span v-if="$i18n.locale == 'ar'">
                          {{ option.name_local || option.name }}
                        </span>
                        <span v-else>
                          {{ option.name || option.name_local }}
                          <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                        {{ option.bylaw ? option.bylaw.faculty.name : '' }} -->
                        </span>
                      </template>
                      <template v-slot:option="option">
                        {{ $i18n.locale == 'ar' ? option.name_local || option.name : option.name || option.name_local }}
                      </template>
                      <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
              
</v-select>
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group :label="$t('Global.pre_university_certificate_type')" label-for="mc-program">
                  <validation-provider #default="{ errors }" name="pre_university_certificate_type" rules="required">
                    <v-select
                      v-model="form.pre_university_certificate_type"
                      :options="certificate_types"
                      :filter="fuseSearch"
                      :disabled="!form.pre_university_certificate && !form.pre_university_certificate_type"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :label="getSelectLabel()"
                      class="w-100"
                      multiple
                      clearable
                      @option:selected="addGrades"
                      @option:deselected="removeGrades"
                    >
                      <template slot="selected-option" slot-scope="option">
                        <span v-if="$i18n.locale == 'ar'">
                          {{ option.name_local || option.name }}
                        </span>
                        <span v-else>
                          {{ option.name || option.name_local }}
                          <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                        {{ option.bylaw ? option.bylaw.faculty.name : '' }} -->
                        </span>
                      </template>
                      <template v-slot:option="option">
                        {{ $i18n.locale == 'ar' ? option.name_local || option.name : option.name || option.name_local }}
                      </template>
                      <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
              
</v-select>
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row v-if="form.pre_university_certificate_type && form.pre_university_certificate_type.length">
              <b-col v-for="(item, index) in grades" md="4">
                <b-form-group :label="item.name" label-for="mc-type">
                  <validation-provider #default="{ errors }" :name="'minimum_grade' + '.' + index">
                    <b-form-input id="mc-type" :placeholder="$t('Global.minimum_grade')" :value="item.minimum_grade" :state="errors.length > 0 ? false : null" @blur="updateItemForm(index, $event, item)" />
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12" class="mt-2">
                <hr />
                <h4 class="my-1">{{ $t('Global.required_subjects') }}</h4>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12" class="mt-2">
                <b-form-checkbox :key="option" v-for="option in options" :id="option.text" v-model="form[option.text]" :name="option.text" :value="true" :unchecked-value="false">{{$t(`Global.${option.text}`)}}</b-form-checkbox>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </template>
      <template #footer>
        <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" class="mr-1" @click="submit"> Submit </b-button>
        <!-- <b-button
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          type="reset"
          variant="outline-secondary"
        >
          Reset
        </b-button> -->
      </template>
    </edit-component>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { BCard, BRow, BCol, BFormGroup, BFormInput, BFormCheckbox, BForm, BButton } from 'bootstrap-vue';
import vSelect from 'vue-select';
import Ripple from 'vue-ripple-directive';
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
import { required, email } from '@validations';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import EditComponent from '@/views/components/table/Edit';

export default {
  name: 'Edit',
  components: {
    EditComponent,
    BCard,
    BCol,
    BRow,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    EditComponent,
    vSelect,
    ValidationObserver,
    ValidationProvider,
    localize,
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      item: 'settings/item',
      loadPrograms: 'programs/load',
      loadUsers: 'users/load',
      loadOfferings: 'offerings/load',
      load: 'offerings/load',
      filteredPrograms: 'programs/items',
      users: 'users/items',
      offerings: 'offerings/items',
      loadTerms: 'terms/load',
      terms: 'terms/items',
      appLoad: 'app/load',
    }),
    certificate_sections() {
      if (this.lookups && this.lookups.certificates) {
        return this.lookups.certificates;
      }
      return false;
    },
    certificates() {
      if (this.lookups && this.lookups.certificates && this.form.pre_university_certificate_groupe) {
        this.certificatesArray = this.lookups.certificates.find(el => el.id == this.form.pre_university_certificate_groupe);
        return this.certificatesArray ? this.certificatesArray.pre_university_certificate : [];
      }
    },
    certificate_types() {
      if (this.lookups && this.lookups.certificates && this.form.pre_university_certificate && this.certificatesArray) {
        const certificateTypeArray = this.certificates ? this.certificates.find(el => el.id == this.form.pre_university_certificate) : {};
        return certificateTypeArray ? certificateTypeArray.pre_university_certificate_type : [];
      }
    },
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    name() {
      // return this.id ? `${this.$t('Global.edit_offering')}` : this.$t('Global.add_offering')
      return this.id ? this.$t('Global.edit_settings') : this.$t('Global.add_settings');
    },
  },
  watch: {
    'form.faculty_id': function (newValue) {
      const query = { faculty_id: newValue.id };
      if (newValue) {
        this.lookupModules = {
          ...this.lookupModules,
          ...query,
        };
      }
      this.getLookups(this.lookupModules).then(data => {
        this.bylaws = data.success.bylaws;
      });
    },
    'form.pre_university_certificate_groupe': function (val, newValue) {
      if (newValue) {
        this.form.pre_university_certificate = null;
      }
    },
    'form.bylaw_id': function (newValue) {
      const query = { bylaw_id: newValue.id };
      if (newValue) {
        this.lookupModules = {
          ...this.lookupModules,
          ...query,
        };
      }
      this.getLookups(this.lookupModules).then(data => {
        this.programs = data.success.programs;
      });
    },
    selected_programs(newValue) {
    },
  },
  data() {
    return {
      grades: [],
      certificatesArray: [],
      options: [
        { text: 'arabic', value: false },
        { text: 'english', value: false },
        { text: 'french', value: false },
        { text: 'german', value: false },
        { text: 'italy', value: false },
        { text: 'math', value: false },
        { text: 'advanced_math', value: false },
        { text: 'biology', value: false },
        { text: 'chemistry', value: false },
        { text: 'physics', value: false },
      ],
      form: {
        arabic:false,
        english:false,
        french:false,
        german:false,
        math:false,
        advanced_math:false,
        biology:false,
        chemistry:false,
        physics:false,
        italy:false,
        minimum_grade: [],
        programs: [],
        instructors: [],
        offerings: [],
        examOfferings: [],
        teachers: [],
        examiners: [],
        pre_university_certificate_groupe: null,
        pre_university_certificate: null,
        pre_university_certificate_type: null,
        pre_university_certificate_types: [],
        bylaw_id: null,
        current_bylaw_id: null,
        teachingAssistant: [],
        course_id: null,
        year: null,
        name: null,
        term_id: null,
        faculty_id: null,
        physics_required: null,
        math_required: null,
        quota: null,
        pre_exam_fees: null,
      },
      types: [],
      assemblyOptions: [
        { name: 'Yes', id: 1 },
        { name: 'No', id: 0 },
      ],
      filter: { bylaw_id: 0 },
      lookups: [],
      lookupModules: {
        bylaws: true,
        terms: true,
        faculties: true,
        programs: true,
        pre_certificates: true,
        programs_details: true,
      },
      form_submit: {},
      bylaws: null,
      programs: null,
      get_programs: [],
      init_programs: [],
      init_bylaws: null,
      init_terms: null,
      init_faculties: null,
      selected_programs: [],
      custom_label: null,
      disable_inputs: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      getItem: 'settings/get',
      getLookups: 'app/GET_LOOKUPS',
      submitItem: 'offerings/put',
      getOfferings: 'offerings/offerings',
      getPrograms: 'programs/programs',
      submitSettings: 'settings/put',
    }),
    addGrades(val) {
      if (val) {
        const last_element = val[val.length - 1];
        this.grades.push({
          certificate_type: last_element.id,
          minimum_grade: null,
          name: last_element.name,
          name_local: last_element.name_local,
        });
      }
    },
    removeGrades(val) {
      if (val) {
        this.grades.pop();
        this.types.pop();
      }
    },
    updateItemForm(index, val, item) {
      this.grades.forEach(el => {
        this.types[index] = {
          certificate_type: item.certificate_type,
          minimum_grade: val.target.value,
        };
      });
    },
    fetchOptions(search) {
      let query;
      if (search) {
        query = { keywords: search || '' };
      }
      this.getPrograms({ query });
    },

    fetchOfferings(search) {
      let query;
      if (search) {
        query = { keywords: search || '' };
      }
      this.$store.dispatch('offerings/offerings', { query });
    },
    fetchUsers(search) {
      let query;
      if (search) {
        query = { keywords: search || '' };
      }
      this.$store.dispatch('users/users', { query });
    },

    fetchTerms(search) {
      let query;
      if (search) {
        query = { keywords: search || '' };
      }
      this.$store.dispatch('terms/terms', { query });
    },

    init() {
      this.getLookups(this.lookupModules).then(data => {
        this.lookups = data.success;
        if (this.id) {
          this.getItem(this.id).then(_ => {
            this.form.bylaw_id = this.item.bylaw;
            this.form.program_id = this.item.program;
            this.form.term_id = this.item.term;
            this.form.faculty_id = this.item.faculty;
            this.form.year = this.item.year;
            this.form.name = this.item.name;
            this.form.physics_required = this.item.data.physics_required;
            this.form.math_required = this.item.data.math_required;
            this.form.quota = this.item.data.quota;
            this.form.pre_exam_fees = this.item.data.pre_exam_fees;
            (this.form.pre_university_certificate_groupe = this.item.data.pre_university_certificate_groupe),
              (this.form.pre_university_certificate = this.item.data.pre_university_certificate),
              (this.form.pre_university_certificate_type = this.item.data.pre_university_certificate_type),
            this.form.pre_university_certificate_type.forEach((el, i) => {
              this.item.data.pre_university_certificate_types.forEach(type => {
                if (el.id == type.certificate_type) {
                  this.grades[i] = {
                    certificate_type: type.certificate_type,
                    minimum_grade: type.minimum_grade,
                    name: el.name,
                    name_local: el.name_local,
                  };
                  this.types[i] = {
                    certificate_type: type.certificate_type,
                    minimum_grade: type.minimum_grade,
                  };
                }
              });
            });
          });
        }
      });
    },
    submit() {
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          const query = {
            faculty_id: this.form.faculty_id.id,
            // bylaw_id: this.form.bylaw_id.id,
            program_id: this.form.program_id.id,
            term_id: this.form.term_id.id,
            year: this.form.year,
            name: this.form.name,
            value: {
              pre_university_certificate_types: this.types,
              physics_required: this.form.physics_required,
              math_required: this.form.math_required,
              current_bylaw_id: this.form.bylaw_id.id,
              quota: this.form.quota,
              pre_exam_fees: this.form.pre_exam_fees,
              pre_university_certificate_type: this.form.pre_university_certificate_type,
              pre_university_certificate_groupe: this.form.pre_university_certificate_groupe.id,
              pre_university_certificate: this.form.pre_university_certificate.id,
            },
          };
          const payload = { id: this.id || null, query };
          this.submitSettings(payload).then(response => {
            this.$toast({
              component: ToastificationContent,
              position: 'top-right',
              props: {
                variant: 'success',
                title: `${this.$t('Global.saved')}`,
              },
            });
            this.$router.go(-1);
          });
        }
      });
    },
    changedBylawId(data) {
      // this.item.program_id = program_id
      const query = { faculty_id: data.id, program_id: data.id };
      if (faculty_id) {
        this.lookupModules = {
          ...this.lookupModules,
          ...{ faculty_id: faculty_id.id },
        };
      }
      this.getLookups(this.lookupModules).then(data => {
        this.bylaws = data.success.bylaws;
        // this.get_programs = data.success.programs
        // const ids = new Set(this.item.programs.map(d => d.id))
        // this.init_programs = [
        //   ...this.item.programs,
        //   ...this.lookups.programs.filter(d => !ids.has(d.id)),
        // ]
        // // this.form.programs = this.get_programs
        // this.get_programs.forEach(value => {
        //   if (this.checkinlist(value, this.init_programs) === false) {
        //     this.form.programs.push(value)
        //   }
        // })
      });
    },
    checkinlist(item, list) {
      let response = false;
      list.forEach(value => {
        if (value.id === item.id) {
          response = true;
          return 0;
        }
      });
      return response;
    },
    getSelectLabel() {
      return this.$i18n.locale == 'en' ? 'name' : 'name_local';
    },
  },
};
</script>

<style scoped></style>
