<template>
  <div class="new_edit">
    <validation-observer ref="simpleRules">
      <b-form ref="form" @submit.stop.prevent="save">
        <ShowComponent v-if="data" :data="data"
                       :only="['min_percentage_final_exam',
                         ...data.type.id != 2?['min_training_weeks']:[],
                         ...data.type.id != 2? ['warning_type'] : [],
                         ...data.type.id != 2?['max_warnings'] : [],
                         ...data.type.id != 2? ['min_gpa_for_graduation'] : [],
                         ...data.type.id != 2? ['max_grade_after_improve'] : [],
                         ...data.type.id != 2? ['last_or_highest_improve_grade'] : [],
                         ...data.type.id != 2? ['failure_overwrites_success'] : [],
                         ...data.type.id == 2 ? ['max_courses_for_fail']:[]
                       ]"
                       :loading="load">
          <template #edit>
            <div class="mb-2">
              <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer"
                            icon="XCircleIcon" class="font-medium-3" @click="cancel"
                            v-if="hasPermission('edit_bylaw')"/>
            </div>
          </template>
          <template #min_percentage_final_exam="{ data }">
            <th scope="row" :width="'40%'">
              {{ $t(`Global.min_percentage_final_exam`) }}
            </th>
            <td>
              <b-form-group label-for="min_percentage_final_exam" invalid-feedback="Name is required">
                <validation-provider :placeholder="$t('Global.min_percentage_final_exam')"
                                     #default="{ errors }" name="min_percentage_final_exam"
                                     rules="required">
                  <b-form-input :placeholder="$t('Global.min_percentage_final_exam')" id="name_local"
                                v-model="form.min_percentage_final_exam"
                                :state="errors.length > 0 ? false : null" type="number" min="0"/>
                  <ValidationErrors default-message :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata, 'min_percentage_final_exam')"/>
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template v-if="data.type.id != 2" #min_training_weeks="{ data }">
            <th scope="row" :width="'40%'">
              {{ $t(`Global.min_training_weeks`) }}
            </th>
            <td>
              <b-form-group label-for="code-input" invalid-feedback="Name is required">
                <validation-provider #default="{ errors }" name="level" rules="required">
                  <b-form-input :placeholder="$t('Global.min_training_weeks')" id="min_training_weeks"
                                v-model="form.min_training_weeks"
                                :state="errors.length > 0 ? false : null" type="number" min="0"/>
                  <ValidationErrors default-message :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata, 'min_training_weeks')"/>
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template v-if="data.type.id != 2" #min_gpa_for_graduation="{ data }">
            <th scope="row" :width="'40%'">
              {{ $t(`Global.min_gpa_for_graduation`) }}
            </th>
            <td>
              <b-form-group label-for="code-input" invalid-feedback="Name is required">
                <validation-provider #default="{ errors }" name="level" rules="required">
                  <b-form-input :placeholder="$t('Global.min_gpa_for_graduation')" id="min_gpa_for_graduation"
                                v-model="form.min_gpa_for_graduation"
                                :state="errors.length > 0 ? false : null" type="number" min="2"/>
                  <ValidationErrors default-message :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata, 'min_gpa_for_graduation')"/>
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template v-if="data.type.id != 2" #warning_type="{ data }">
            <th scope="row" :width="'40%'">
              {{ $t(`Global.warning_type`) }}
            </th>
            <td>
              <b-form-group label-for="warning_type" invalid-feedback="Name is required">
                <validation-provider :placeholder="$t('Global.warning_type')" #default="{ errors }"
                                     name="warning_type" rules="required">
                  <v-select :clearable="false" :class="errors.length > 0 ? 'custom_invalid' : ''"
                            v-if="types" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                            v-model="form.warning_type" :options="types" class="w-100"
                            :reduce="val => val.id">
                    <template v-slot:option="option">
                      {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                    </template>
                    <template #selected-option="{ name, name_local }">
                      <div style="display: flex; align-items: baseline">
                        <span v-if="$i18n.locale == 'ar'">{{ name_local }}</span>
                        <span v-else>{{ name }}</span>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <ValidationErrors default-message :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata, 'warning_type')"/>
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template v-if="data.type.id != 2" #max_warnings="{ data }">
            <th scope="row" :width="'40%'">
              {{ $t(`Global.max_warnings`) }}
            </th>
            <td>
              <b-form-group label-for="max_warnings" invalid-feedback="Max warnings required">
                <validation-provider :placeholder="$t('Global.max_warnings')"
                                     #default="{ errors }" name="max_warnings"
                                     rules="required">
                  <b-form-input :placeholder="$t('Global.max_warnings')" id="max_warnings"
                                v-model="form.max_warnings"
                                :state="errors.length > 0 ? false : null" type="number" min="0"/>
                  <ValidationErrors default-message :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata, 'max_warnings')"/>
                  <span>{{ $t('Global.max_warnings_hint') }}</span>
                </validation-provider>
              </b-form-group>
            </td>
          </template>

          <template v-if="data.type.id != 2" #max_grade_after_improve="{ data }">
            <th scope="row" :width="'40%'">
              {{ $t(`Global.max_grade_after_improve`) }}
            </th>
            <td>
              <b-form-group label-for="warning_type" invalid-feedback="Name is required">
                <validation-provider :placeholder="$t('Global.max_grade_after_improve')" #default="{ errors }"
                                     name="warning_type" rules="required">
                  <v-select :clearable="false" :class="errors.length > 0 ? 'custom_invalid' : ''"
                            v-if="gradesTypes" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                            v-model="form.max_grade_after_improve" :options="gradesTypes" class="w-100"
                            :reduce="val => val.id">
                    <template v-slot:option="option">
                      {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                    </template>
                    <template #selected-option="{ name, name_local }">
                      <div style="display: flex; align-items: baseline">
                        <span v-if="$i18n.locale == 'ar'">{{ name_local }}</span>
                        <span v-else>{{ name }}</span>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <ValidationErrors default-message :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata, 'warning_type')"/>
                </validation-provider>
              </b-form-group>
            </td>
          </template>

          <template v-if="data.type.id != 2" #last_or_highest_improve_grade="{ data }">
            <th scope="row" :width="'40%'">
              {{ $t(`Global.last_or_highest_improve_grade`) }}
            </th>
            <td>
              <b-form-group label-for="warning_type" invalid-feedback="Name is required">
                <validation-provider :placeholder="$t('Global.last_or_highest_improve_grade')" #default="{ errors }"
                                     name="warning_type" rules="required">
                  <v-select :clearable="false" :class="errors.length > 0 ? 'custom_invalid' : ''"
                            v-if="improveGradesOptions" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                            v-model="form.last_or_highest_improve_grade" :options="improveGradesOptions" class="w-100"
                            :reduce="val => val.id">
                    <template v-slot:option="option">
                      {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                    </template>
                    <template #selected-option="{ name, name_local }">
                      <div style="display: flex; align-items: baseline">
                        <span v-if="$i18n.locale == 'ar'">{{ name_local }}</span>
                        <span v-else>{{ name }}</span>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <ValidationErrors default-message :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata, 'warning_type')"/>
                </validation-provider>
              </b-form-group>
            </td>
          </template>

          <template v-if="data.type.id != 2" #failure_overwrites_success="{ data }">
            <th scope="row" :width="'40%'">
              {{ $t(`Global.failure_overwrites_success`) }}
            </th>
            <td>
              <b-form-group label-for="warning_type" invalid-feedback="Name is required">
                <validation-provider :placeholder="$t('Global.failure_overwrites_success')" #default="{ errors }"
                                     name="warning_type" rules="required">
                  <b-form-checkbox v-model="form.failure_overwrites_success" name="check-button" switch />
                  <ValidationErrors default-message :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata, 'warning_type')"/>
                </validation-provider>
              </b-form-group>
            </td>
          </template>

          <template v-if="data.type.id == 2" #max_courses_for_fail="{ data }">
            <th scope="row" :width="'40%'">
              {{ $t(`Global.max_courses_for_fail`) }}
            </th>
            <td>
              <b-form-group label-for="max_courses_for_fail" invalid-feedback="Name is required">
                <validation-provider :placeholder="$t('Global.max_courses_for_fail')"
                                     #default="{ errors }" name="max_courses_for_fail"
                                     rules="required">
                  <b-form-input :placeholder="$t('Global.max_courses_for_fail')" id="name_local"
                                v-model="form.max_courses_for_fail"
                                :state="errors.length > 0 ? false : null" type="number" min="0"/>
                  <ValidationErrors default-message :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata, 'max_courses_for_fail')"/>
                </validation-provider>
              </b-form-group>
            </td>
          </template>
        </ShowComponent>
        <b-row>
          <b-col md="12" :class="load ? 'disabled_all' : ''">
            <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary"
                      class="mr-1">
              {{ $t('Global.save') }}
            </b-button>
            <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="reset" variant="outline-secondary"
                      @click="cancel">
              {{ $t('Global.cancel') }}
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {BButton, BCard, BCol, BForm, BFormCheckbox, BFormGroup, BFormInput, BRow} from 'bootstrap-vue';
import vSelect from 'vue-select';
import Ripple from 'vue-ripple-directive';
import {ValidationProvider, ValidationObserver, localize} from 'vee-validate';
import {required, email, regex} from '@validations';
import EditComponent from '@/views/components/table/Edit';
import ValidationErrors from '@/views/components/common/ValidationErrors';
import ShowComponent from '@/views/components/info/show';

export default {
  title: 'Edit',
  components: {
    ShowComponent,
    ValidationErrors,
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
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      item: 'bylaws/item',
      load: 'app/load',
      options: 'students/lookups',
    }),
    id() {
      if (this.params && this.params.id) return this.params.id;
      return this.$route.params.id ? this.$route.params.id : null;
    },
    title() {
      return (this.id && !this.params) || (this.params && this.params.status == 2) ? this.$t('Global.bylaw_edit') : this.$t('Global.bylaw_add');
    },
    types() {
      return [
        {'id': 1, name: "Semester GPA", name_local: "المعدل الفصلي "},
        {'id': 2, name: "Cumulative GPA", name_local: "المعدل التراكمي"},
      ];
    }
  },
  props: {
    inline: {default: false, Type: Boolean},
    params: {},
    data: {default: {}, type: [Array, Object]},
  },
  data() {
    return {
      form: {
        min_percentage_final_exam: null,
        warning_type: null,
        min_training_weeks: null,
        max_courses_for_fail: null,
        min_gpa_for_graduation: null,
        max_warnings: 1,
        max_grade_after_improve: null,
        last_or_highest_improve_grade: null,
        failure_overwrites_success: false
      },
      errorsdata: {},
      gradesTypes: [],
      improveGradesOptions: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      getItem: 'bylaws/get',
      lookups: 'app/GET_LOOKUPS',
    }),
    checkIfArabic(type) {
      const arabic = /[\u0600-\u06FF]/;
      if (type == 'en') {
        if (arabic.test(this.item.name)) {
          this.item.name = '';
        } else {
          return this.item.name;
        }
      } else if (type == 'ar') {
        if (!arabic.test(this.item.name_local)) {
          this.item.name_local = '';
        } else {
          return this.item.name_local;
        }
      }
    },
    init() {

      if ((this.id && !this.params) || (this.params && this.params.status == 2)) {
        let query = {
          grades_types: this.id,
          last_or_highest_improve_grade: true,
        }
        this.lookups(query).then((res) => {
          this.gradesTypes = res.success.gradesTypes;
          this.improveGradesOptions = res.success.improveGradesOptions;

          this.form.max_courses_for_fail = this.data.max_courses_for_fail;
          this.form.min_percentage_final_exam = this.data.min_percentage_final_exam;
          this.form.warning_type = this.data.warning_type ? this.data.warning_type.id : null;
          this.form.min_training_weeks = this.data.min_training_weeks;
          this.form.min_gpa_for_graduation = this.data.min_gpa_for_graduation;
          this.form.max_warnings = this.data.max_warnings;
          this.form.max_grade_after_improve = this.data.max_grade_after_improve ? this.data.max_grade_after_improve.id : null;
          this.form.last_or_highest_improve_grade = this.data.last_or_highest_improve_grade ? this.data.last_or_highest_improve_grade.id : null;
          this.form.failure_overwrites_success = this.data.failure_overwrites_success ? true : false;
        })
      } else {
        this.form = {};
      }
    },

    save() {
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          const payload = {
            id: this.id,
            query: this.form,
          };
          this.$store.dispatch('bylaws/setSettings', payload)
              .then(response => {
                this.$swal({
                  icon: 'success',
                  title: `${this.$t('Global.saved')}`,
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.$emit('refresh', response.data.id);
                if (!this.id) {
                  this.$router.push({name: 'bylaw', params: {id: response.data.id}});
                }
              })
              .catch(error => {
                this.errorsdata = this.handleBackendError(error.response.data.errors);
              });
        }
      });
    },
    cancel() {
      if (!this.id) {
        this.$router.go(-1);
      }
      if (this.inline) {
        return this.$emit('hide');
      }
      // if (this.$route.params.faculty_id) {
      //   this.$router.push({ name: 'faculty', params: { id: this.$route.params.faculty_id } });
      // } else {
      //   this.$router.push({ name: 'bylaws' });
      // }
    },
  },
};
</script>

<style scoped></style>
