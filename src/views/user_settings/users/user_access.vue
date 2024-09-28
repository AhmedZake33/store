<template>
  <div>
    <b-overlay :show="loading" rounded="sm">
      <edit-component :name="this.userTitle">
        <template #inputs>
          <validation-observer ref="simpleRules">
            <b-form ref="formRequest" @submit.stop.prevent="save">
              <b-row>
                <b-col md="12" v-for="(input, k) in formRequest.access" :key="k">
                  <b-row>
                    <b-col md="12">
                      <hr v-if="k != 0" />
                      <h6>{{ $t('User Access') }}</h6>
                    </b-col>
                    <b-col md="12">
                      <b-row :class="input.duplicatedError ? 'duplicated-record' : ''">
                        <b-col md="11">
                          <b-row>
                            <b-col md="3">
                              <b-form-group v-if="options" :label="$t('Role')" label-for="role-input">
                                <validation-provider #default="{ errors }" :name="'role(' + (k + 1) + ')'" rules="required">
                                  <v-select v-model="input.role_id" :label="'name'" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="roles ? roles : []" :clearable="false" input-id="role-input" :reduce="val => val.id">
                                    <template v-slot:option="option">
                                      {{ option.name }}
                                    </template>
                                    <template #selected-option="{ name }">
                                      <div style="display: flex; align-items: baseline">
                                        <strong>{{ name }}</strong>
                                      </div>
                                    </template>
                                    <template #no-options>
                                      {{ $t('noMatching') }}
                                    </template>
                                  </v-select>
                                  <ValidationErrors :frontend-errors="validationErrorMessage(errors)" />
                                </validation-provider>
                              </b-form-group>
                            </b-col>

                            <b-col md="3">
                              <b-form-group v-if="options" :label="$t('Global.faculty')" label-for="faculty-input">
                                <validation-provider #default="{ errors }" :name="'faculty(' + (k + 1) + ')'" rules="">
                                  <v-select
                                    :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                                    v-model="input.faculty_id"
                                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                    :clearable="true"
                                    input-id="faculty-input"
                                    :reduce="val => val.id"
                                    @input="prop => updateFaculty(input, prop, k)"
                                    :value="input.id"
                                    :options="options ? options.faculties : []"
                                  >
                                    <template v-slot:option="option">
                                      {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                                    </template>
                                    <template #selected-option="{ name, name_local }">
                                      <div style="display: flex; align-items: baseline">
                                        <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                                        <strong v-else>{{ name }}</strong>
                                      </div>
                                    </template>
                                    <template #no-options>
                                      {{ $t('noMatching') }}
                                    </template>
                                  </v-select>
                                  <ValidationErrors :frontend-errors="validationErrorMessage(errors)" />
                                </validation-provider>
                              </b-form-group>
                            </b-col>

                            <b-col md="3">
                              <b-form-group v-if="options" :label="$t('Global.stage')" label-for="stage-input">
                                <validation-provider #default="{ errors }" name="stage_id" rules="">
                                  <v-select
                                    :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                                    v-model="input.stage_id"
                                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                    :clearable="true"
                                    input-id="stage-input"
                                    :reduce="val => val.id"
                                    @input="prop => updateStage(input, prop, k)"
                                    :value="input.id"
                                    :options="stages"
                                  >
                                    <template slot="selected-option" slot-scope="option">
                                      <span v-if="$i18n.locale == 'ar'">
                                        {{ option.name_local || option.name }}
                                      </span>
                                      <span v-else>
                                        {{ option.name + ' ( ' + option.code + ' )' || option.name_local }}
                                      </span>
                                    </template>
                                    <template v-slot:option="option">
                                      {{ $i18n.locale == 'ar' ? option.name_local : option.name + ' ( ' + option.code + ' )' }}
                                    </template>
                                    <template #no-options>
                                      {{ $t('noMatching') }}
                                    </template>
                                  </v-select>
                                  <ValidationErrors :frontend-errors="errors" />
                                </validation-provider>
                              </b-form-group>
                            </b-col>

                            <b-col md="3">
                              <b-form-group :label="$t('program')" label-for="program-input">
                                <v-select
                                  :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                                  v-model="input.selected_programs"
                                  :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                  v-if="input.facultyUpdated && input.stageUpdated"
                                  :options="ProgramArray[input.faculty_id]"
                                  :clearable="true"
                                  multiple
                                  input-id="program-input"
                                  :reduce="val => val.id"
                                  :value="input.id"
                                  @input="prop => programsList(input, prop, k)"
                                  :disabled="!input.faculty_id"
                                >
                                  <template v-slot:option="option">
                                    {{ $i18n.locale == 'ar' ? option.name_local + `(${option.bylaw.name_local ? option.bylaw.name_local : '-'})` : option.name + `(${option.bylaw.name ? option.bylaw.name : '-'})` }}
                                  </template>
                                  <template #selected-option="{ name, name_local, bylaw }">
                                    <div style="display: flex; align-items: baseline">
                                      <strong v-if="$i18n.locale == 'ar'"> {{ name_local }}{{ `(${bylaw.name_local ? bylaw.name_local : '-'})` }} </strong>
                                      <strong v-else> {{ name }}{{ `(${bylaw.name ? bylaw.name : '-'})` }} </strong>
                                    </div>
                                  </template>
                                  <template #no-options>
                                    {{ $t('noMatching') }}
                                  </template>
                                </v-select>
                              </b-form-group>
                            </b-col>

                            <b-col md="3">
                              <b-form-group v-if="options" :label="$t('department')" label-for="department-input">
                                <validation-provider #default="{ errors }" name="department" rules="">
                                  <v-select
                                    v-model="input.department_id"
                                    :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                    v-if="input.facultyUpdated"
                                    :options="departmentArray[input.faculty_id]"
                                    :clearable="true"
                                    input-id="department-input"
                                    :reduce="val => val.id"
                                    :disabled="!input.faculty_id"
                                  >
                                    <template v-slot:option="option">
                                      {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                                    </template>
                                    <template #selected-option="{ name, name_local }">
                                      <div style="display: flex; align-items: baseline">
                                        <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                                        <strong v-else>{{ name }}</strong>
                                      </div>
                                    </template>
                                    <template #no-options>
                                      {{ $t('noMatching') }}
                                    </template>
                                  </v-select>
                                  <ValidationErrors :frontend-errors="errors" />
                                </validation-provider>
                              </b-form-group>
                            </b-col>
                          </b-row>
                        </b-col>

                        <b-col md="1">
                          <b-button v-ripple.400="'rgba(234, 84, 85, 0.15)'" variant="outline-danger" class="mt-0 mt-md-2 float-right" @click="remove(k)" v-if="k != 0">
                            <feather-icon icon="XIcon" />
                          </b-button>
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                </b-col>
                <!--   actions buttons (add & reset) -->
                <b-col md="12">
                  <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" class="float-right mt-0 mt-md-2" variant="primary" @click="addNewCard">
                    <feather-icon icon="PlusIcon" class="text-md-right" />
                    {{ $t('Add User Access') }}
                  </b-button>
                  <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" class="float-right mt-0 mt-md-2 mr-1" variant="danger" @click="resetUserAccess()">
                    {{ $t('Reset') }}
                  </b-button>
                </b-col>
                <!-- submit and reset -->
                <b-col md="12">
                  <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" class="mr-1">
                    {{ $t('Global.save') }}
                  </b-button>
                  <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" variant="outline-secondary" @click="cancel">
                    {{ $t('Global.cancel') }}
                  </b-button>
                </b-col>
              </b-row>
            </b-form>
          </validation-observer>
        </template>
      </edit-component>
    </b-overlay>
  </div>

</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { BRow, BCol, BFormGroup, BFormInput, BFormCheckbox, BForm, BButton, BOverlay } from 'bootstrap-vue';
import vSelect from 'vue-select';
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
import { required, between } from '@validations';
import ValidationErrors from '@/views/components/common/ValidationErrors';
import Ripple from 'vue-ripple-directive';
import EditComponent from '@/views/components/table/Edit';
import { forEach } from 'postcss-rtl/lib/affected-props';
import Global from '@/api/system/global';
const global = new Global();

export default {
  title: 'access',
  components: {
    EditComponent,
    BCol,
    BRow,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    vSelect,
    ValidationErrors,
    ValidationProvider,
    ValidationObserver,
    localize,
    BOverlay,
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      options: 'app/lookups',
      userAccessData: 'users/userAccess',
      loading: 'users/load',
    }),
    roles() {
      if (this.options.roles) {
        return this.sortList(this.options.roles);
      }
    },
    id() {
      if (this.params && this.params.id) return this.params.id;
      return this.$route.params.id ? this.$route.params.id : null;
    },
    userTitle() {
      return `${this.$t('User Access Of')} ( ${this.getTranslatedName(this.userAccessData.user)} )`;
    },
  },
  data() {
    return {
      stages: [
        {
          id: 1,
          code: 'UG',
          name: 'Undergraduate',
          name_local: 'طلاب',
        },
        {
          id: 2,
          code: 'PG',
          name: 'Postgraduate',
          name_local: 'دراسات عليا',
        },
      ],
      formRequest: {
        access: [
          {
            role_id: null,
            faculty_id: null,
            department_id: null,
            stage_id: null,
            programs: [],
            selected_programs: [],
            oldSelectedPrograms: [],
            facultyUpdated: true,
            stageUpdated: true,
            duplicatedError: false,
          },
        ],
        delete_access: [],
      },
      query: {
        faculties: true,
        roles: true,
      },

      errorsdata: {},
      access: [],
      show: false,
      /*
       * [
       *   3,
       * ]
       * */
      ProgramArray: [],
      departmentArray: [],
    };
  },
  methods: {
    ...mapActions({
      lookups: 'app/GET_LOOKUPS',
      addUserAccess: 'users/accessUser',
      getUserAccessData: 'users/getUserAccess',
      resetAllUserAccess: 'users/resetUserAccess',
    }),
    ...mapMutations({
      loadingMutate: 'users/SET_USERS_LOAD',
    }),

    sortList(data) {
      return data.sort(function (a, b) {
        var nameA = a.name.toLowerCase(),
          nameB = b.name.toLowerCase();
        if (nameA < nameB)
          //sort string ascending
          return -1;
        if (nameA > nameB) return 1;
        return 0; //default return value (no sorting)
      });
    },

    init() {
      this.lookups(this.query);

      this.getUserAccessData(this.id).then(res => {
        if (this.userAccessData.data.length > 0) {
          this.formRequest.access = [];
        } else {
          this.loadingMutate(false);
        }

        res.data.data.forEach((element, key) => {
          let objectData = {};

          objectData.facultyUpdated = false;
          objectData.stageUpdated = false;
          objectData.faculty_id = element.faculty_id;
          objectData.role_id = element.role_id;
          objectData.department_id = element.department_id;
          objectData.stage_id = element.stage_id;
          //to get facutly programs
          let queryPrograms = {
            faculty_departments: true,
            faculty_id: objectData.faculty_id,
            faculty_id_programs_with_bylaw: true,
          };
          global.getLookups(queryPrograms).then(resData => {
            if (!this.ProgramArray[element.faculty_id]) {
              const options = resData.success;
              this.ProgramArray[element.faculty_id] = options.programs;
              this.departmentArray[element.faculty_id] = options.faculty_departments;
            }

            objectData.selected_programs = [];
            objectData.oldSelectedPrograms = [];
            element.programs.forEach(e => {
              if (e.program_id) {
                objectData.selected_programs.push(e.program_id);
              }
              objectData.programs = [];
              objectData.programs.push({
                access_id: e.access_id,
                program_id: e.program_id,
              });

              //to set old selected programs
              objectData.oldSelectedPrograms[e.program_id] = e.access_id;

              objectData.facultyUpdated = true;
              objectData.stageUpdated = true;
            });
            this.formRequest.access.push(objectData);
            this.loadingMutate(false);
          });
        });
      });
    },
    cancel() {
      this.$router.go(-1);
    },
    save() {
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          // to check duplication of records
          if (this.validateDuplicateFormData(this.formRequest.access)) {
            this.errorToast(this.$t('Please Check Duplicated Records'));
            return;
          }

          const payload = { id: this.id, query: this.formRequest };
          this.addUserAccess(payload)
            .then(response => {
              this.$swal({
                icon: 'success',
                title: `${this.$t('Global.saved')}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.$router.go(-1);
            })
            .catch(error => {
              this.errorsdata = this.handleBackendError(error.response.data.errors);
            });
        }
      });
    },
    updateFaculty(data, facultyId, index) {
      this.formRequest.access[index].faculty_id = facultyId;
      this.formRequest.access[index].department_id = null;
      this.formRequest.access[index].selected_programs = [];
      this.formRequest.access[index].facultyUpdated = false;

      this.query = {
        ...this.query,
        faculty_departments: true,
        faculty_id: facultyId,
        faculty_id_programs_with_bylaw: true,
      };
      if (data.stage_id) {
        this.query = {
          ...this.query,
          stage_id: data.stage_id,
        };
      }
      this.lookups(this.query).then(res => {
        if (!this.ProgramArray[facultyId]) {
          const options = res.success;
          this.ProgramArray[facultyId] = options.programs;
          this.departmentArray[facultyId] = options.faculty_departments;
        }
        this.formRequest.access[index].facultyUpdated = true;
      });
    },
    updateStage(data, stageId, index) {
      this.formRequest.access[index].stage_id = stageId;
      this.formRequest.access[index].department_id = null;
      this.formRequest.access[index].selected_programs = [];
      this.formRequest.access[index].stageUpdated = false;

      this.query = {
        ...this.query,
        faculty_departments: true,
        stage_id: stageId,
        faculty_id_programs_with_bylaw: true,
      };
      if (data.faculty_id) {
        this.query = {
          ...this.query,
          faculty_id: data.faculty_id,
        };
      }
      this.lookups(this.query).then(res => {
        const options = res.success;
        this.ProgramArray[data.faculty_id] = options.programs;
        this.departmentArray[data.faculty_id] = options.faculty_departments;
        this.formRequest.access[index].stageUpdated = true;
      });
    },
    addNewCard() {
      this.formRequest.access.push({
        role_id: null,
        faculty_id: null,
        department_id: null,
        stage_id: null,
        program_id: null,
        selected_programs: [],
        programs: [],
        oldSelectedPrograms: [],
        facultyUpdated: true,
        stageUpdated: true,
        duplicatedError: false,
      });
    },
    remove(index) {
      this.rerender = false;
      setTimeout(() => {
        this.rerender = true;
      }, 50);
      if (this.formRequest.access[index].programs) {
        this.formRequest.access[index].programs.forEach(data => {
          if (data.access_id) {
            this.formRequest.delete_access.push(data.access_id);
          }
        });
      }
      this.formRequest.access.splice(index, 1);
    },
    programsList(data, prop, index) {
      this.formRequest.access[index].programs = [];
      this.formRequest.access[index].selected_programs = [];
      // new => [1,4,6]   old => {1},{5},{4}   action => 5 removed
      data.oldSelectedPrograms.forEach((value, key) => {
        if (!prop.includes(key) && !this.formRequest.delete_access.includes(value)) {
          this.formRequest.delete_access.push(value);
        } else {
          // this.formRequest.delete_access = this.formRequest.delete_access.filter((v)=>{
          //   return v != value;
          // })
        }
      });
      prop.forEach(element => {
        let newAccessId = data.oldSelectedPrograms[element] ?? null;
        // search  & check if item old selected or not
        this.formRequest.access[index].programs.push({
          access_id: newAccessId,
          program_id: element,
        });
        this.formRequest.access[index].selected_programs.push(element);
      });
    },
    resetUserAccess() {
      this.$swal({
        title: `${this.$t('Global.deleteTitle')}`,
        text: `${this.$t('You are about to delete all user access !')}`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        confirmButtonText: `${this.$t('Global.deleteBtn')}`,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-primary ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.resetAllUserAccess(this.id).then(_ => {
            this.$swal({
              icon: 'success',
              title: `${this.$t('Global.saved')}`,
              showConfirmButton: false,
              timer: 1500,
            });
            this.$router.go(-1);
          });
        }
      });
    },
    validationErrorMessage(errors) {
      if (errors.length) {
        errors[0] = errors[0].replace(/\(.*?\)/gi, '');
      }
      return errors;
    },
    validateDuplicateFormData(formDataArr) {
      let founded = false;
      formDataArr.forEach((object, index) => {
        formDataArr.find((o, i) => {
          if (i > index && o.role_id == object.role_id && o.faculty_id == object.faculty_id && o.department_id == object.department_id && o.stage_id == object.stage_id) {
            formDataArr[i].duplicatedError = true;
            founded = true;
            return true;
          }
        });
        if (founded) return;
      });
      return founded;
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style scoped>
.duplicated-record {
  border: 1px solid red;
  border-radius: 7px;
}
</style>
