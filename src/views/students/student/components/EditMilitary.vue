<template>
  <div>
    <div class="new-edit">
      <validation-observer ref="fromRules">
        <b-form
            ref="formRequest"
            @submit.stop.prevent="save"
        >
          <b-row>
            <!--Military Status-->
            <b-col
                md="12"
            >
              <list
                  style="padding: 0 !important"
                  :data="input"
                  :only="[]"
                  :title="$t('Global.military_service_information')"
                  :has-margins="false"
                  class="new_edit"
              >
                <template #custom_show>
                  <tr>
                    <th
                        scope="row"
                        :width="'30%'"
                    >
                      {{ $t(`Global.military_status`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.military_status')"
                              rules="required"
                          >
                            <v-select
                                v-model="input.military_status"
                                :label="$i18n.locale == 'en' ? 'name':'name_local'"
                                :dir="$store.state.appConfig.layout.isRTL? 'rtl': 'ltr'"
                                :options="lookups.military_status"
                                :clearable="true"
                                input-id="field-input"
                                :reduce="(val) => val.id"
                            >
                              <template v-slot:option="option">
                                {{ $i18n.locale == 'en' ? option.name : option.name_local }}
                              </template>
                              <template #selected-option="{ name, name_local }">
                                <div style="display: flex;align-items: baseline;">
                                  <strong>{{ $i18n.locale == 'en' ? name : name_local }}</strong>
                                </div>
                              </template>
                              <template #no-options>
                                {{ $t("noMatching") }}
                              </template>
                            </v-select>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                  <!--Military Number-->
                  <tr>
                    <th
                        scope="row"
                        :width="'30%'"
                    >
                      {{ $t(`Global.military_service_no`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.military_service_no')"
                          >
                            <b-form-input v-model="input.military_service_no"/>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                  <!--Military Info-->
                  <tr>
                    <th
                        scope="row"
                        :width="'30%'"
                    >
                      {{ $t(`Global.decisions_no`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.decisions_no')"
                          >
                            <b-form-input v-model="input.military_decisions_no"/>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                  <!--Military Order-->
                  <tr>
                    <th
                        scope="row"
                        :width="'30%'"
                    >
                      {{ $t(`Global.date_of_decision`) }}
                    </th>
                    <td
                        class="width-10"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.date_of_decision')"
                          >
                            <b-form-datepicker type="date" v-model="input.military_decision_date" @click="toggleDate"/>
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
                      {{ $t(`Global.military_situation`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.military_situation')"
                          >
                            <b-form-input v-model="input.military_situation"/>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                  <div class="mt-3 mb-1">{{ $t('Global.military_training_information') }}</div>
                  <!--Military Training-->
                  <tr>
                    <th
                        scope="row"
                        :width="'30%'"
                    >
                      {{ $t(`Global.military_training_status`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.military_training_status')"
                          >
                            <b-form-checkbox
                                v-model="input.military_training_status"
                                switch
                            />
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
                      {{ $t(`Global.year_of_completion`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.year_of_completion')"
                          >
                            <b-form-input :maxLength="4" v-model="input.military_training_completion_year"/>
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
                      {{ $t(`Global.round_number`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.military_status')"
                              
                          >
                            <v-select
                                v-model="input.military_training_round_no"
                                :label="$i18n.locale == 'en' ? 'name':'name_local'"
                                :dir="$store.state.appConfig.layout.isRTL? 'rtl': 'ltr'"
                                :options="lookups.military_rounds"
                                :clearable="true"
                                input-id="field-input"
                                :reduce="(val) => val.id"
                            >
                              <template v-slot:option="option">
                                {{ $i18n.locale == 'en' ? option.name : option.name_local }}
                              </template>
                              <template #selected-option="{ name, name_local }">
                                <div style="display: flex;align-items: baseline;">
                                  <strong>{{ $i18n.locale == 'en' ? name : name_local }}</strong>
                                </div>
                              </template>
                              <template #no-options>
                                {{ $t("noMatching") }}
                              </template>
                            </v-select>
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
                      {{ $t(`Global.page_no`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.page_no')"
                          >
                            <b-form-input v-model="input.military_training_page_no"/>
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
                      {{ $t(`Global.serial_no`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.serial_no')"
                          >
                            <b-form-input v-model="input.military_training_serial_no"/>
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
                      {{ $t(`Global.Comment`) }}
                    </th>
                    <td
                        class=" width-70"
                    >
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.serial_no')"
                          >
                            <b-form-input v-model="input.military_training_comment"/>
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
            <b-col md="12" class="pl-md-3">
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
  BFormDatepicker,
  BFormTextarea,
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
    BFormDatepicker,
    localize,
    BFormCheckbox
  },
  directives: {
    Ripple,
  },
  props: {
    editModeVersion: String,
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
      errorsdata: {},
      language: this.$i18n.locale,
      load: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions({
      getItem: 'students/getEdit',
      putItem: 'students/put',
      lookupsMethod: 'students/lookup',
      updateEditMode: 'students/updateEditMode',
    }),
    toggleDate(evt) {
      this.$nextTick(() => {
        this.focus()
      })
    },
    init() {
      const payload = {
        id: this.id,
        details: 3,
      }
      this.load = true
      this.getItem(payload).then(res => {
        this.input.military_service_no = res.data.military_service_no;
        this.input.military_decisions_no = res.data.military_decisions_no;
        this.input.military_decision_date = res.data.military_decision_date;
        this.input.military_situation = res.data.military_situation;
        this.input.military_training_completion_year = res.data.military_training_completion_year;
        this.input.military_training_round_no = res.data.military_training_round_no;
        this.input.military_training_page_no = res.data.military_training_page_no;
        this.input.military_training_serial_no = res.data.military_training_serial_no;
        this.input.military_training_comment = res.data.military_training_comment;
        this.load = false
      })
    },
    async save() {
      let payload = {}
      const approval = await this.$refs.fromRules.validate()
      if (!approval) return null

      const query = {
        military_status: this.input.military_status,
        military_service_no: this.input.military_service_no,
        military_decisions_no: this.input.military_decisions_no,
        military_decision_date: this.input.military_decision_date,
        military_situation: this.input.military_situation,
        military_training_status: this.input.military_training_status,
        military_training_completion_year: this.input.military_training_completion_year,
        military_training_round_no: this.input.military_training_round_no,
        military_training_page_no: this.input.military_training_page_no,
        military_training_serial_no: this.input.military_training_serial_no,
        military_training_comment: this.input.military_training_comment,
      }
      payload = {
        id: this.id,
        query: query,
        details: 'military_info',
      }

      this.putItem(payload).then(res => {
        this.$swal({
          icon: 'success',
          title: `${this.$t('Global.saved')}`,
          showConfirmButton: false,
          timer: 1500,
        })
        this.closeEditMode()
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
