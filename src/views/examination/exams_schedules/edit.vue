<template>
  <div>
    <div class="new_edit">
      <validation-observer ref="simpleRules">
        <b-form ref="form" @submit.stop.prevent="save($event)">
          <ShowComponent
              :loading="load"
              v-if="data"
              :data="data"
              :only="[
                'course',
                'exam',
                'exam_date',
                'id',
                'slots',
                'locations_capacity',
                'locations',
                'paper_types',
                'minutes',
                'notes',
            ]"
          >
            <template #course>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.offering`) }}
              </th>
              <td>
                <b-form-group
                    class="left_right"
                    label-for="offerings-input"
                    v-if="lookups"
                >
                  <validation-provider
                      #default="{ errors }"
                      name="offerings"
                      rules="required"
                  >
                    <v-select
                        v-model="form.offering_id"
                        :options="searchOfferings"
                        :class="errors.length > 0 ? 'custom_invalid' : ''"
                        :label="getSelectLabel()"
                        class="w-100"
                        :placeholder="$t('offerings')"
                        :filterable="false"
                        clearable
                        :dir=" $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr' "
                        :reduce="(val) => val.id"
                        @search="fetchOfferings"

                    >
                      <template
                          v-slot:option="option"
                          v-if="$i18n.locale == 'ar'"
                      >
                        {{ option.course.code }}: {{ option.course.name_local }} ({{ option.students_per_offering }}
                        طالب)
                      </template>
                      <template v-slot:option="option" v-else>
                        {{ option.course.code }}: {{ option.course.name }} ({{ option.students_per_offering }} Student)
                      </template>

                      <template slot="selected-option" slot-scope="option">
                          <span
                              v-if="$i18n.locale == 'ar'"
                          >
                            {{ option.course.code }}: {{ option.course.name_local }} ({{ option.students_per_offering }} طالب)</span
                          >
                        <span
                            v-else
                        >
                            {{ option.course.code }}: {{ option.course.name }} ({{ option.students_per_offering }} Student)
                          </span>
                      </template>
                      <template #no-options>
                        {{ $t('noMatching') }}
                      </template>
                    </v-select>
                    <small
                        class="text-danger"
                        v-for="(error, index) in errors"
                        :key="index"
                    >
                      {{
                        $i18n.locale == 'ar'
                            ? `حقل ${$t('Global.offerings')} مطلوب`
                            : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #exam>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.exam`) }}
              </th>
              <td>
                <div>
                  <b-form-group
                      class="left_right"
                      label-for="exam-input"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="exam"
                        rules="required"
                    >
                      <v-select
                          v-model="exam_id_param"
                          :get-option-label="getLabel"
                          :options="lookups.exams"
                          :filter="fuseSearch"
                          disabled
                          :placeholder="$t('exam')"
                      >
                        <template #no-options>
                          {{ $t('noMatching') }}
                        </template>
                      </v-select>
                      <small
                          class="text-danger"
                          v-for="(error, index) in errors"
                          :key="index"
                      >
                        {{
                          $i18n.locale == 'ar'
                              ? `حقل ${$t('Global.exam')} مطلوب`
                              : error
                        }}
                      </small>
                    </validation-provider>
                  </b-form-group>
                </div>
              </td>
            </template>
            <template #paper_types v-if="item">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.paper_types`) }}
              </th>
              <td>
                <div v-if="item">
                  <div v-for="paper in item.paper_types" :key="paper.id">
                    {{ $i18n.locale == 'ar' ? paper.name_local : paper.name }}
                  </div>
                </div>
              </td>
            </template>
            <template #minutes v-if="item">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.minutes`) }}
              </th>
              <td>
                <div v-if="item.minutes">
                  {{ item.minutes }}
                </div>
              </td>
            </template>
            <template #notes v-if="item">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.notes`) }}
              </th>
              <td>
                <div v-if="item.notes">
                  {{ item.notes }}
                </div>
              </td>
            </template>
            <template #exam_date>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.exam_date`) }}
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
                    <b-form-datepicker
                        :label-no-date-selected="$t('Global.no_selected')"
                        :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                        id="date-input"
                        v-model="form.exam_date"
                        :state="errors.length > 0 ? false : null"
                        :placeholder="$t('Global.exam_date')"
                    />
                    <small
                        class="text-danger"
                        v-for="(error, index) in errors"
                        :key="index"
                    >
                      {{
                        $i18n.locale == 'ar'
                            ? `حقل ${$t('Global.exam_date')} مطلوب`
                            : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #id>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.start_time`) }}
              </th>
              <td>
                <b-form-group
                    class="left_right"
                    label-for="offerings-input"
                    v-if="lookups.slots"
                >
                  <validation-provider
                      #default="{ errors }"
                      name="start time"
                      rules="required"
                  >
                    <v-select
                        v-model="form.start_slot_id"
                        :label="getSelectLabel()"
                        :options="lookups.slots"
                        :reduce="(val) => val.id"
                        :placeholder="$t('Global.start_time')"
                        :disabled="form.exam_date == null"
                    >
                      <template slot="option" slot-scope="option">
                        {{ `${option.title} ( ${option.start.slice(0, -3)} - ${option.end.slice(0, -3)} )` }}
                      </template>
                      <template slot="selected-option" slot-scope="option">
                        {{ `${option.title} ( ${option.start.slice(0, -3)} - ${option.end.slice(0, -3)} )` }}
                      </template>
                    </v-select>
                    <small
                        class="text-danger"
                        v-for="(error, index) in errors"
                        :key="index"
                    >
                      {{
                        $i18n.locale == 'ar'
                            ? `حقل ${$t('Global.start_time')} مطلوب`
                            : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #slots>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.slots`) }}
              </th>
              <td class="d-flex">
                <b-form-group
                    class="left_right"
                    label-for="offerings-input"
                >
                  <validation-provider
                      #default="{ errors }"
                      name="number of slots"
                      rules="required"
                  >
                    <v-select
                        v-model="form.num_of_slots"
                        :label="getSelectLabel()"
                        :options="slots"
                        :reduce="(val) => val"
                        :placeholder="$i18n.locale == 'ar' ? 'عدد الفترات' : 'Number of Slots'"
                        :disabled="form.start_slot_id == null"
                    >
                      <template #no-options>
                        {{ $t('noMatching') }}
                      </template>
                    </v-select>
                    <small
                        class="text-danger"
                        v-for="(error, index) in errors"
                        :key="index"
                    >
                      {{
                        $i18n.locale == 'ar'
                            ? `حقل ${'عدد الفترات'} مطلوب`
                            : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #locations_capacity>
                <th scope="row" :width="'20%'">
                    {{ $t(`Global.locations_capacity_types`) }}
                </th>
                <td class="d-flex">
                  <div class="demo-inline-spacing">
                        <!-- v-model="form.type" -->
                      <b-form-radio
                        name="some-radio9"
                        v-model="form.locations_capacity_type"
                        value="1"
                        class="custom-control-primary"
                      >
                      {{ $t("Global.exam_capacity") }} ({{ $t("Global.default") }})
                      </b-form-radio>
                        <!-- v-model="form.type" -->
                      <b-form-radio
                        name="some-radio9"
                        v-model="form.locations_capacity_type"
                        value="2"
                        class="custom-control-primary"
                      >
                        {{ $t("Global.study_capacity") }}
                      </b-form-radio>
                  </div>
                </td>
            </template>
            <template #locations>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.locations`) }}
              </th>
              <td class="d-flex">
                <b-form-group
                    label-for="offerings-input"
                >
                  <validation-provider
                      #default="{ errors }"
                      name="locations"
                      rules="required"
                  >
                    <v-select
                        v-if="!locations || locations.locations == 0"
                        :disabled="true"
                        :label="getSelectLabel()"
                        :options="[]"
                        :placeholder="$t(`Global.locations`)"
                    />
                    <v-select
                        v-else
                        v-model="form.location_ids"
                        multiple
                        :label="getSelectLabel()"
                        :options="locations.locations"
                        :reduce="(val) => val.id"
                        :placeholder="$t('Global.locations')"
                    >
                      <template slot="option" slot-scope="option">
                        <!-- <option disabled v-if="option.occupied_capacity == option.capacity"
                                style="background: #054978; color: #fff; margin: -7px -20px !important; padding: 7px 20px"
                        >
                          {{
                            $i18n.locale == 'ar'
                                ? option.name_local +
                                `(${option.occupied_capacity}/${option.capacity})`
                                : option.name +
                                  `(${option.occupied_capacity}/${option.capacity})`
                            }}
                          </option> -->
                          <option v-if="form.locations_capacity_type == 2">
                            {{
                              $i18n.locale == "ar"
                                ? option.name_local +
                                  `(${option.occupied_capacity}/${option.capacity})`
                                : option.name +
                                `(${option.occupied_capacity}/${option.capacity})`
                          }}
                        </option>
                        <option v-else>
                          {{
                            $i18n.locale == 'ar'
                                ? option.name_local +
                                `(${option.occupied_capacity}/${option.exam_capacity})`
                                : option.name +
                                `(${option.occupied_capacity}/${option.exam_capacity})`
                          }}
                        </option>
                      </template>
                      <template slot="selected-option" slot-scope="option">
                        <option v-if="form.locations_capacity_type == 2">
                            {{
                              $i18n.locale == "ar"
                                ? option.name_local +
                                  `(${option.occupied_capacity}/${option.capacity})`
                                : option.name +
                                  `(${option.occupied_capacity}/${option.capacity})`
                            }}
                          </option>
                          <option v-else>
                            {{
                              $i18n.locale == 'ar'
                                ? option.name_local +
                                  `(${option.occupied_capacity}/${option.exam_capacity})`
                                : option.name +
                                  `(${option.occupied_capacity}/${option.exam_capacity})`
                            }}
                          </option>
                      </template>
                      <template #no-options>
                        {{ $t('noMatching') }}
                      </template>
                    </v-select>
                    <small
                        class="text-danger"
                        v-for="(error, index) in errors"
                        :key="index"
                    >
                      {{
                        $i18n.locale == 'ar'
                            ? `حقل ${$t('Global.locations')} مطلوب`
                            : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #edit>
              <div class="mt-0 mb-1">
                <feather-icon
                    icon="XCircleIcon"
                    v-b-tooltip.hover="$t('Global.cancel')"
                    class="font-medium-3"
                    style="cursor: pointer"
                    @click="cancel()"
                    v-if="hasPermission('edit_examSchedule')"
                />
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
                {{ $i18n.locale == 'ar' ? 'حفظ' : 'Save' }}
              </b-button>
              <b-button
                  v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                  type="reset"
                  variant="outline-secondary"
                  @click="cancel"
              >
                {{ $i18n.locale == 'ar' ? 'الغاء' : 'Cancel' }}
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
    </div>

    <b-modal
        ref="my-modal"
        size="lg"
        v-model="statusModal"
        hide-footer
        no-close-on-backdrop
        no-close-on-esc
        hide-header-close
    >
      <template #modal-title>
        <div class="d-flex justify-content-between w-100">

          <strong>
            {{ $t(`Global.${statusTitle}`) }}
          </strong>
        </div>
      </template>
      <div class="demo-vertical-spacing">
        <b-form>
          <b-col
              cols="12"
              md="12"
              class="height-250 overflow-y-scroll"
              v-if="status_messages.length"
          >
            <div
                class="bg-gray"
                v-for="(status_message, index) in status_messages"
                :key="index"
            >
              <template>
                <b-alert :variant="statusClass" show>
                  <div class="alert-body">
                  <span>
                    {{
                      index + 1 + ', ' + status_message.code + ', ' + getTranslatedName(status_message) +
                      " (" +  status_message.course_code + ": " + ($i18n.locale === "ar" ? status_message.course_name_local : status_message.course_name)
                      + ")"
                    }}
                  </span>
                  </div>
                </b-alert>
              </template>
            </div>
          </b-col>
        </b-form>
      </div>
      <div class="mt-2">
        <b-col cols="12" md="12">
          <div class="d-flex justify-content-end">
            <b-button
                type="reset"
                class="mr-1"
                variant="primary"
                @click="save($event, true)"
            >
              {{ $t('Global.save') }}
            </b-button>
            <b-button
                type="reset"
                variant="outline-primary"
                @click="statusModal = false"
            >
              {{ $t('Global.close') }}
            </b-button>
          </div>
        </b-col>
      </div>
    </b-modal>
  </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component'
import EditComponent from '@/views/components/table/Edit'
import ValidationErrors from '@/views/components/common/ValidationErrors'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import {
  extend,
  ValidationProvider,
  ValidationObserver,
  localize,
} from 'vee-validate'
import { mapGetters, mapActions } from 'vuex'
import { required } from '@validations'
import { PlusIcon, DeleteIcon } from 'vue-feather-icons'
import ShowComponent from '@/views/components/info/show'

import {
  BCard,
  BRow,
  BCol,
  BLink,
  BFormGroup,
  BFormInput,
  BForm,
  BButton,
  BFormTextarea,
  BSpinner,
  BPopover,
  BFormDatepicker,
  BFormCheckbox, BAlert, BModal,
  BFormRadio,
} from 'bootstrap-vue'
import { forEach } from 'postcss-rtl/lib/affected-props'

export default {
  name: 'edit',
  components: {
    BModal,
    BAlert,
    EditComponent,
    ShowComponent,
    vSelect,
    ValidationErrors,
    required,
    DeleteIcon,
    PlusIcon,
    BFormRadio,
    ValidationProvider,
    ValidationObserver,
    BForm,
    BFormGroup,
    BCard,
    BRow,
    BCol,
    BLink,
    BFormInput,
    BButton,
    BFormTextarea,
    BSpinner,
    BPopover,
    localize,
    BFormDatepicker,
    BFormCheckbox,
    extend,
    flatPickr,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      flag: false,
      errorsdata: {},
      searchOfferings: [],
      waitFetchOfferings: false,
      examDateState: null,
      form: {
        offering_id: null,
        exam_date: null,
        start_slot_id: null,
        num_of_slots: null,
        locations_capacity_type: null,
        location_ids: [],
        exam_id: null,
      },
      status_messages: [],
      statusModal: false,
      statusClass: '',
      statusTitle: '',
    }
  },
  watch: {
    handleChangedData(newVal, oldVal) {
      const dataHolder = newVal.split('|')
      dataHolder.includes('null') ? (this.flag = false) : (this.flag = true)
      if (this.flag == true) {
        this.$store
            .dispatch('examsSchedules/getAvailableLocations', {
              query: {
                exam_date: this.form.exam_date,
                start_slot_id: this.form.start_slot_id,
                num_of_slots: this.form.num_of_slots,
                offering_id: this.form.offering_id,
                locations: 'locations',
              locations_capacity_type: parseInt(this.form.locations_capacity_type)
            },
            examId: this.exam_id_param,
          })
          .then((_) => {
            this.flag = false
              this.form.location_ids = this.item && this.$route.name != 'add_exam_schedule' ? this.item.location_ids : []
            })
      } else {
        this.$store.state.examsSchedules.locations = null
        this.form.location_ids = []
      }
    },
    "form.locations_capacity_type"(newVal){
      if(this.form.exam_date && this.form.start_slot_id && this.form.num_of_slots && this.form.offering_id && newVal ){
        this.$store
          .dispatch("examsSchedules/getAvailableLocations", {
            query: {
              exam_date: this.form.exam_date,
              start_slot_id: this.form.start_slot_id,
              num_of_slots: this.form.num_of_slots,
              offering_id: this.form.offering_id,
              locations: "locations",
              locations_capacity_type: parseInt(this.form.locations_capacity_type)
            },
            examId: this.exam_id_param,
          })
      }
    }
  },
  computed: {
    ...mapGetters({
      lookups: 'examsSchedules/lookups',
      exams: 'examsSchedules/exams',
      item: 'examsSchedules/item',
      locations: 'examsSchedules/locations',
      load: 'examsSchedules/load',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null
    },
    title() {
      return this.id ? this.$t('Edit Exam Schedule') : this.$t('Add Exam Schedule')
    },
    exam_id_param() {
      return this.$route.query.exam_id ? this.$route.query.exam_id : null
    },
    slots() {
      let slotsIDs = this.lookups.slots.map((object) => object.id)
      let start_slot_id = slotsIDs.indexOf(this.form.start_slot_id)
      let opts = []
      let count = this.form.start_slot_id
          ? this.lookups.slots.length - start_slot_id
          : null
      for (let i = 1; i <= count; i++) {
        opts.push(i)
      }
      if (opts.length == 0 || this.form.num_of_slots > opts.length) {
        this.form.num_of_slots = null
      }
      return opts
    },
    handleChangedData() {
      return `${
          this.form.num_of_slots +
          `|` +
          this.form.exam_date +
          `|` +
          this.form.start_slot_id +
          `|` +
          this.form.offering_id
      }`
    },
  },
  props: {
    inline: {
      default: false,
      Type: Boolean
    },
    tabNumber: Number,
    data: {
      default: {},
      type: [Array, Object]
    },
  },
  methods: {
    ...mapActions({
      getItem: 'examsSchedules/get',
      getLookups: 'examsSchedules/lookups',
    }),
    init() {
      this.form.locations_capacity_type = 1;
      if (this.id) {
        this.getItem(this.id)
            .then((_) => {
              this.form.exam_date = this.item?.exam_date
              this.form.location_ids = this.item?.location_ids
              this.searchOfferings.push(this.item?.offering)
              this.form.exam_id = this.item?.exam?.id
              this.form.offering_id = this.item?.offering_id
              this.form.start_slot_id = this.item?.start_slot_id
              this.form.num_of_slots = this.item?.num_of_slots
          // this.form.locations_capacity_type = 'exam_capacity';
        })
      }
    },
    fetchOfferings(search, load) {
      let exam = this.lookups.exams.find(x => x.id == this.exam_id_param)
      if (search.length >= 3 && !this.waitFetchOfferings) {
        this.waitFetchOfferings = true
        load(true)
        const query = {
          query: {
            search_all_offerings_keyword: search,
            term_id: exam.term_id,
            exam_id: this.exam_id_param,
            slots: 'slots'
          }
        }
        this.searchOfferings = []
        this.getLookups(query)
            .then(response => {
              let myArray = response.data.all_offerings.filter(ar => !this.searchOfferings.find(rm => (ar.id === rm.id)))
              this.searchOfferings.push(...myArray)
              load(false)
              this.waitFetchOfferings = false
            })
      }
    },
    cancel() {
      if (!this.id) {
        this.$router.push({
          name: 'exams_schedules',
          query: { exam_id: this.exam_id_param },
        })
      }
      if (this.inline) {
        return this.$emit('hide')
      }
    },
    save(event, overrideConflicts = false) {
      this.$refs.simpleRules.validate()
          .then((success) => {
            if (success) {
              this.form.exam_id = this.exam_id_param ? this.exam_id_param : null;
              const payload = {
                id: this.id,
                query: {...this.form, overrideConflicts: overrideConflicts},
              }
              this.$store
                  .dispatch('examsSchedules/put', payload)
                  .then((response) => {
                    this.$swal({
                      icon: 'success',
                      title: `${this.$t('Global.saved')}`,
                      showConfirmButton: false,
                      timer: 1500,
                    })

                    this.statusModal = false;
                    this.status_messages = [];
                    this.statusClass = '';
                    this.statusTitle = '';
                    if (!this.id) {
                      this.$router.replace({
                        name: 'exams_schedules',
                        query: { exam_id: this.exam_id_param },
                      })
                    }

                    if (this.inline) {
                      this.$emit('refresh')
                      return this.$emit('hide')
                    }
                  })
                  .catch((error) => {
                    if (error.response.data.errors.data === undefined) {

                      this.statusModal = false;
                      this.status_messages = [];
                      this.statusClass = '';
                      this.statusTitle = '';

                      let message = null
                      if (error.response.data.errors.title) {
                        message = error.response.data.errors.title[0]
                      } else if (error.response.data.errors.offering_id) {
                        message = error.response.data.errors.offering_id[0]
                      } else {
                        message = this.$t('Global.errorMessage')
                      }

                      this.$swal({
                        icon: 'error',
                        text: this.$i18n.locale == 'ar' ? message.ar : message.en,
                        showConfirmButton: false,
                        timer: 3000,
                      })
                    } else {
                      if (error.response.data.errors.status === 'error') {
                        this.statusClass = 'danger'
                        this.statusTitle = 'Error, one or more exams in the same time!'
                      } else {
                        this.statusClass = 'warning'
                        this.statusTitle = 'Warning, one or more exams in the same day!'
                      }

                      this.status_messages = error.response.data.errors.data
                      this.statusModal = true
                    }
                  })
            }
          })
    },
    getLabel(option) {
      if (typeof option === 'object') {
        return this.$i18n.locale == 'ar' ? option.name_local : option.name
      }
      const optionObject = this.lookups.exams.find(item => item.id.toString() === option.toString())
      if (optionObject) {
        return this.$i18n.locale == 'ar' ? optionObject.name_local : optionObject.name
      }
      return option
    }
  },
  mounted() {
    this.$store.dispatch('examsSchedules/lookups', {
      query: {
        offerings: 'offerings',
        slots: 'slots'
      },
      examId: this.exam_id_param,
    })
    this.init()

  },
}
</script>
<style scoped lang="scss">
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>
<style scoped>
.demo-inline-spacing > * {
    margin-top: 0.5rem !important;
}
</style>
