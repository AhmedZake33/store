<template>
  <div class="new-edit">
    <div class="new-edit">
      <validation-observer ref="fromRules">
        <b-form
            ref="formRequest"
            @submit.stop.prevent="save"
        >
          <b-row>
            <b-col
                md="12"
            >
              <list
                  style="padding: 0 !important"
                  :data="input"
                  :only="[]"
                  :has-margins="false"
                  class="new_edit"
              >
                <template #custom_show>
                  <tr>
                    <th
                        scope="row"
                        :width="'30%'"
                    >
                      {{ $t(`Global.total`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.total')"
                          >
                            <b-form-input v-model="input.grades_final.total"/>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <th
                        scope="row"
                        :width="'30%'"
                    >
                      {{ $t(`Global.total_final`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.total_final')"
                          >
                            <b-form-input v-model="input.grades_final.total_final"/>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <th
                        scope="row"
                        :width="'30%'"
                    >
                      {{ $t(`Global.max_total`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.max_total')"
                          >
                            <b-form-input v-model="input.grades_final.max_total"/>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="!isSemesterBased">
                    <th
                        scope="row"
                        :width="'30%'"
                    >
                      {{ $t(`Global.gpa`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.gpa')"
                          >
                            <b-form-input v-model="input.grades_final.gpa"/>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="!isSemesterBased">
                    <th
                        scope="row"
                        :width="'30%'"
                    >
                      {{ $t(`Global.credit_hours`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.credit_hours')"
                          >
                            <b-form-input v-model="input.grades_final.credit_hours"/>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="!isSemesterBased">
                    <th
                        scope="row"
                        :width="'30%'"
                    >
                      {{ $t(`Global.credit_points`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.credit_points')"
                          >
                            <b-form-input v-model="input.grades_final.credit_points"/>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <th
                        scope="row"
                        :width="'30%'"
                    >
                      {{ $t(`Global.project_total`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.project_total')"
                          >
                            <b-form-input v-model="input.grades_final.project_total"/>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <th
                        scope="row"
                        :width="'30%'"
                    >
                      {{ $t(`Global.project_max_total`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.project_max_total')"
                          >
                            <b-form-input v-model="input.grades_final.project_max_total"/>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="!isSemesterBased">
                    <th
                        scope="row"
                        :width="'30%'"
                    >
                      {{ $t(`Global.project_gpa`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.project_gpa')"
                          >
                            <b-form-input v-model="input.grades_final.project_gpa"/>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="!isSemesterBased">
                    <th
                        scope="row"
                        :width="'30%'"
                    >
                      {{ $t(`Global.project_ch`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.project_ch')"
                          >
                            <b-form-input v-model="input.grades_final.project_credit_hours"/>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="!isSemesterBased">
                    <th
                        scope="row"
                        :width="'30%'"
                    >
                      {{ $t(`Global.project_cp`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.project_cp')"
                          >
                            <b-form-input v-model="input.grades_final.project_credit_points"/>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <th
                        scope="row"
                        :width="'30%'"
                    >
                      {{ $t(`Global.honour`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.honour')"
                          >
                            <b-form-checkbox
                                v-model="input.grades_final.honour"
                                switch
                            />
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                </template>
              </list>

            </b-col>
            <!--               submit and reset -->
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
                  variant="outline-secondary"
                  @click="closeEditMode"
              >
                {{ $t("Global.cancel") }}
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
    </div>
    <div
        v-if="loading"
        style="
          position: absolute;
          width: 100%;
          top:0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #eee;
          opacity: 0.8;
          text-align: center;
          z-index: 999;
          "
    >
      <b-spinner
          variant="primary"
          style="position: absolute;top: 60px;z-index: 1000"
      />
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import vSelect from 'vue-select'
import {
  BRow,
  BCol,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
  BForm,
  BFormTextarea,
  BSpinner,
} from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import EditComponent from '@/views/components/table/Edit'
import Ripple from 'vue-ripple-directive'
import ValidationErrors from '@/views/components/common/ValidationErrors'
import {
  required, email, regex, integer, mobileValidation,
} from '@validations'
import {ValidationProvider, ValidationObserver, localize} from 'vee-validate'
import List from '@/views/components/info/list'
import request from "@/utils/request";

export default {
  title: 'Edit',
  components: {
    BRow,
    BCol,
    BFormGroup,
    vSelect,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
    EditComponent,
    ValidationErrors,
    ValidationProvider,
    ValidationObserver,
    List,
    BForm,
    BFormTextarea,
    BFormInput,
    localize,
    BFormCheckbox,
    BSpinner,
  },
  directives: {
    Ripple,
  },
  props: {
    editModeVersion: String,
    isSemesterBased: Boolean,
  },
  computed: {
    ...mapGetters({
      input: 'students/item',
      load: 'students/load',
      lookups: 'students/lookups',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null
    },
    details() {
      return this.$route.params.details ? this.$route.params.details : null
    },
    query() {
      const data = {
        countries: true,
        advisors: true,
        terms: true,
        lookup_from: 'students',
      }
      return data
    },
    lang() {
      return this.$i18n.locale
    },
    editPartion() {
      return this.editModeVersion
    },
    studentName() {
      const lang = this.$i18n.locale
      if (lang == 'en') return 'Edit Student '
      if (lang == 'ar') return 'تعديل طالب'
    },
    loading() {
      return this.load
    },
  },
  data() {
    return {
      form: {},
      test: true,
      errorsdata: {},
      language: this.$i18n.locale,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions({
      updateEditMode: 'students/updateEditMode',
    }),
    init() {
      this.$store.dispatch("students/get", {
        type: "grades_final",
        id: this.$route.params.id ? this.$route.params.id : (this.$route.params.student_id ? this.$route.params.student_id : null),
      });
    },
    async save() {

      const query = {
        gpa: this.input.grades_final.gpa,
        total: this.input.grades_final.total,
        total_final: this.input.grades_final.total_final,
        max_total: this.input.grades_final.max_total,
        credit_points: this.input.grades_final.credit_points,
        credit_hours: this.input.grades_final.credit_hours,
        project_gpa: this.input.grades_final.project_gpa,
        project_total: this.input.grades_final.project_total,
        project_max_total: this.input.grades_final.project_max_total,
        project_credit_points: this.input.grades_final.project_credit_points,
        project_credit_hours: this.input.grades_final.project_credit_hours,
        honour: this.input.grades_final.honour,
      }

      request.post(
          `grades/update_grades_final/${this.$route.params.id}`, {
            id: this.id,
            data: query,
          }
      ).then(res => {

        this.$swal({
          icon: 'success',
          timer: 1400,
          showConfirmButton: false,
          title: this.$t('Global.saved'),
        })
        this.init();
        this.closeEditMode()
      }).catch(err => {
        this.$swal({
          icon: 'error',
          timer: 1400,
          showConfirmButton: false,
          title: err.response.data.errors[0].title,
        })
      })
    },
    getBack() {
      this.$router.push({name: 'student-show', params: {id: this.id}})
    },
    closeEditMode() {
      this.$emit('closeEditMode', false)
    },
    destroyEdit() {
      this.updateEditMode({status: false, edit_info: null})
    },
  },
}
</script>

<style lang="scss" scoped>
[dir] .table th, [dir] .table td {
  padding: 0;
}

[dir] .table td {
  padding-top: 3px;
  padding-right: 3px;
  padding-bottom: 3px;
}

[dir] .form-group {
  margin-bottom: 0;
}

.new_edit {
  .b-form-datepicker {
    margin-bottom: 0 !important;
  }

  ::placeholder {
    color: #777 !important;
    opacity: 0.8 !important;
  }

  td {
    padding: 0.2rem 23px !important;
    padding-inline-start: 25px !important;
  }

  tr {
    align-items: center;
  }

  textarea.form-control {
    padding: 0.2rem 0.5rem !important;
  }

  .form-group {
    .vs--disabled {
      background-color: #f8f8f8;
    }

    .vs__selected {
      padding: 0;
      margin: 0;
    }

    .v-select div {
      flex-direction: row !important;
    }

    margin-bottom: 0;
    width: 100%;
    padding-left: 0px;
    padding-right: 8px;

    .vs__selected,
    .vs__search {
      margin-top: 0 !important;
    }

    .form-control,
    .vs__dropdown-toggle {
      border: 0;
      box-shadow: 0 3px 10px 0 rgb(34 41 47 / 10%);
      // border-left: 1px dashed #777;
      background: transparent;
      background-color: transparent !important;
      height: 30px;
      padding: 0.2rem 0.5rem;
    }

    .form-control.text-break {
      box-shadow: none !important;
    }

    .vs--searchable:not(.vs--single) .vs__dropdown-toggle {
      height: auto !important;
    }

    .vs--searchable.vs--single {
      .vs__dropdown-toggle {
        margin-bottom: 0;
      }

      margin-bottom: 0;
    }
  }
}
</style>
